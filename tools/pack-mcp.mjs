import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const packageDirectory = resolve('dist/aeris-mcp');
const destination = resolve('dist/packages');
mkdirSync(destination, { recursive: true });

const bundledNpmExecutable = resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const npmExecutable =
  process.env.npm_execpath ?? (existsSync(bundledNpmExecutable) ? bundledNpmExecutable : undefined);
const command = npmExecutable ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const arguments_ = npmExecutable
  ? [npmExecutable, 'pack', packageDirectory, '--pack-destination', destination, '--ignore-scripts']
  : ['pack', packageDirectory, '--pack-destination', destination, '--ignore-scripts'];
const result = spawnSync(command, arguments_, {
  cwd: process.cwd(),
  encoding: 'utf8',
  stdio: 'inherit',
  shell: !npmExecutable && process.platform === 'win32',
  env: {
    ...process.env,
    npm_config_cache: resolve('.angular/npm-cache'),
  },
});

if (result.error) {
  process.stderr.write(`Could not create the Aeris MCP package: ${result.error.message}\n`);
  process.exit(1);
}

process.exit(result.status ?? 1);
