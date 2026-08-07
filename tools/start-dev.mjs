import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const isWindows = process.platform === 'win32';
const workspaceRoot = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const normalizedWorkspaceRoot = normalizePath(workspaceRoot);
const angularRoot = join(workspaceRoot, '.angular');
const cacheRoot = join(angularRoot, 'cache');
const cacheMarkerPath = join(cacheRoot, '.aeris-workspace.json');
const sessionPath = join(angularRoot, 'aeris-dev-session.json');
const ngBin = join(workspaceRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const docsHost = process.env['AERIS_DOCS_HOST']?.trim() || '127.0.0.1';
const parsedPort = Number.parseInt(process.env['AERIS_DOCS_PORT'] ?? '4200', 10);
const docsPort = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
  ? parsedPort
  : 4200;
const preflightOnly = process.argv.includes('--preflight-only');

let shuttingDown = false;
let serveStarted = false;
let serveProcess;
let libraryWatch;
let ownsSession = false;

if (!existsSync(ngBin)) {
  console.error(`Angular CLI was not found in ${join(workspaceRoot, 'node_modules')}. Run npm install first.`);
  process.exit(1);
}

try {
  await runPreflight();
} catch (error) {
  console.error(`\nAeris development startup stopped: ${errorMessage(error)}\n`);
  process.exit(1);
}

if (preflightOnly) {
  console.log(`Aeris development preflight passed for ${workspaceRoot}.`);
  process.exit(0);
}

createSession();

libraryWatch = spawn(
  process.execPath,
  [ngBin, 'build', 'aeris-ui', '--watch', '--configuration', 'development'],
  {
    cwd: workspaceRoot,
    stdio: ['inherit', 'pipe', 'pipe'],
  },
);

function startServe() {
  if (serveStarted || shuttingDown) return;

  serveStarted = true;
  console.log(`\nLibrary build is ready. Starting docs at http://${docsHost}:${docsPort}/...\n`);

  serveProcess = spawn(
    process.execPath,
    [
      ngBin,
      'serve',
      'docs',
      '--configuration',
      'development',
      '--host',
      docsHost,
      '--port',
      String(docsPort),
    ],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
    },
  );

  serveProcess.on('exit', (code, signal) => {
    if (shuttingDown) return;
    void shutdown(code ?? (signal ? 1 : 0));
  });
}

async function runPreflight() {
  process.chdir(workspaceRoot);
  mkdirSync(angularRoot, { recursive: true });
  clearStaleSession();
  await assertPortAvailable();
  prepareWorkspaceCache();
}

function clearStaleSession() {
  if (!existsSync(sessionPath)) return;

  const session = readJson(sessionPath);
  const sessionPid = typeof session?.pid === 'number' ? session.pid : null;
  const sessionRoot = typeof session?.workspaceRoot === 'string' ? session.workspaceRoot : 'unknown';

  if (sessionPid && processIsRunning(sessionPid)) {
    throw new Error(
      `another Aeris development session is already running (PID ${sessionPid}, workspace ${sessionRoot}). ` +
        'Stop it with Ctrl+C before running npm start again.',
    );
  }

  rmSync(sessionPath, { force: true });
}

function prepareWorkspaceCache() {
  let clearReason = '';

  if (existsSync(cacheRoot)) {
    const marker = readJson(cacheMarkerPath);
    const markerRoot = typeof marker?.workspaceRoot === 'string'
      ? normalizePath(marker.workspaceRoot)
      : '';

    if (!markerRoot) clearReason = 'it predates workspace tracking';
    else if (markerRoot !== normalizedWorkspaceRoot) {
      clearReason = `it belongs to ${marker.workspaceRoot}`;
    }
  }

  if (clearReason) {
    console.log(`Clearing Angular cache because ${clearReason}.`);
    rmSync(cacheRoot, { recursive: true, force: true });
  }

  mkdirSync(cacheRoot, { recursive: true });
  writeFileSync(
    cacheMarkerPath,
    `${JSON.stringify({ workspaceRoot, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8',
  );
}

function createSession() {
  writeFileSync(
    sessionPath,
    `${JSON.stringify(
      {
        pid: process.pid,
        workspaceRoot,
        docsHost,
        docsPort,
        startedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  ownsSession = true;
}

function assertPortAvailable() {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = createServer();

    server.unref();
    server.once('error', (error) => {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
        rejectPromise(
          new Error(
            `port ${docsPort} is already in use. Another docs server may still be running. ` +
              `Stop that process before starting Aeris from ${workspaceRoot}.`,
          ),
        );
        return;
      }
      rejectPromise(error);
    });
    server.listen(docsPort, docsHost, () => server.close(resolvePromise));
  });
}

function processIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return Boolean(
      error && typeof error === 'object' && 'code' in error && error.code === 'EPERM',
    );
  }
}

async function killProcessTree(child) {
  if (!child?.pid || child.exitCode !== null) return;

  if (isWindows) {
    await new Promise((resolvePromise) => {
      const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      killer.once('error', resolvePromise);
      killer.once('exit', resolvePromise);
    });
    return;
  }

  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolvePromise) => child.once('exit', resolvePromise)),
    new Promise((resolvePromise) => setTimeout(resolvePromise, 2000)),
  ]);
  if (child.exitCode === null) child.kill('SIGKILL');
}

async function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  await Promise.all([killProcessTree(serveProcess), killProcessTree(libraryWatch)]);
  removeOwnedSession();
  process.exit(code);
}

function removeOwnedSession() {
  if (!ownsSession) return;
  const session = readJson(sessionPath);
  if (session?.pid === process.pid) rmSync(sessionPath, { force: true });
  ownsSession = false;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function normalizePath(path) {
  const normalized = resolve(path).replaceAll('\\', '/');
  return isWindows ? normalized.toLowerCase() : normalized;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

let recentOutput = '';

libraryWatch.stdout.on('data', (chunk) => {
  const output = chunk.toString();
  process.stdout.write(output);
  recentOutput = `${recentOutput}${output}`.slice(-4000);

  if (recentOutput.includes('Built Angular Package')) startServe();
});

libraryWatch.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
});

libraryWatch.on('exit', (code, signal) => {
  if (shuttingDown) return;

  if (!serveStarted) {
    console.error('\nLibrary watch exited before the initial build completed.');
  }

  void shutdown(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));
process.on('SIGHUP', () => void shutdown(0));
process.on('uncaughtException', (error) => {
  console.error(error);
  void shutdown(1);
});
process.on('unhandledRejection', (error) => {
  console.error(error);
  void shutdown(1);
});
process.on('exit', removeOwnedSession);
