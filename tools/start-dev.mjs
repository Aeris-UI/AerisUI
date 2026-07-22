import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const isWindows = process.platform === 'win32';
const ngBin = join(process.cwd(), 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

if (!existsSync(ngBin)) {
  console.error('Angular CLI was not found in node_modules. Run npm install first.');
  process.exit(1);
}

let shuttingDown = false;
let serveStarted = false;
let serveProcess;

const libraryWatch = spawn(
  process.execPath,
  [ngBin, 'build', 'aeris-ui', '--watch', '--configuration', 'development'],
  {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
  },
);

function startServe() {
  if (serveStarted || shuttingDown) return;

  serveStarted = true;
  console.log('\nLibrary build is ready. Starting docs dev server...\n');

  serveProcess = spawn(process.execPath, [ngBin, 'serve', 'docs', '--configuration', 'development'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  serveProcess.on('exit', (code, signal) => {
    if (shuttingDown) return;
    shutdown(code ?? (signal ? 1 : 0));
  });
}

function killProcessTree(child) {
  if (!child?.pid || child.killed) return;

  if (isWindows) {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    return;
  }

  child.kill('SIGTERM');
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  killProcessTree(serveProcess);
  killProcessTree(libraryWatch);
  process.exitCode = code;
}

let recentOutput = '';

libraryWatch.stdout.on('data', (chunk) => {
  const output = chunk.toString();
  process.stdout.write(output);
  recentOutput = `${recentOutput}${output}`.slice(-4000);

  if (recentOutput.includes('Built Angular Package')) {
    startServe();
  }
});

libraryWatch.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
});

libraryWatch.on('exit', (code, signal) => {
  if (shuttingDown) return;

  if (!serveStarted) {
    console.error('\nLibrary watch exited before the initial build completed.');
  }

  shutdown(code ?? (signal ? 1 : 0));
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('SIGHUP', () => shutdown(0));
