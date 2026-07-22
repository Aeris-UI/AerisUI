#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import {
  AERIS_THEME_PRESETS,
  AerisThemeGenerationError,
  compileAerisTheme,
  mergeAerisTheme,
  resolveAerisTheme,
} from '../fesm2022/aeris-ui-core-theme-builder.mjs';

const HELP = `Aeris UI build-time theme generator

Usage:
  aeris-theme [options]

Options:
  --preset <name>    earth, coastal, orchid, or monochrome (default: earth)
  --config <path>    JSON configuration file
  --derivation-version <number>
                      Expected color derivation contract version
  --output <path>    Write CSS to a file; stdout when omitted
  --selector <value> CSS selector that owns the variables (default: :root)
  --schemes <value>  both, light, or dark (default: both)
  --default-mode <value>
                      system, light, or dark (default: system for both)
  --minify            Emit compact CSS
  --no-system         Do not emit prefers-color-scheme rules
  --no-contrast-validation
                      Generate without enforcing WCAG contrast checks
  --help              Show this help

CLI options override values from the JSON configuration file.`;

try {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(`${HELP}\n`);
  } else {
    const config = args.config ? await readConfiguration(args.config) : {};
    const presetName = args.preset ?? config.preset ?? 'earth';
    const preset = AERIS_THEME_PRESETS[presetName];
    if (!preset) {
      throw new Error(
        `Unknown preset "${presetName}". Choose earth, coastal, orchid, or monochrome.`,
      );
    }

    const theme = config.theme
      ? mergeAerisTheme(resolveAerisTheme(preset), config.theme)
      : resolveAerisTheme(preset);
    const result = compileAerisTheme(theme, {
      expectedDerivationVersion: args.derivationVersion ?? config.derivationVersion,
      validateContrast: args.validateContrast ?? config.css?.validateContrast,
      selector: args.selector ?? config.css?.selector,
      includeSystemMode: args.includeSystemMode ?? config.css?.includeSystemMode,
      schemes: args.schemes ?? config.css?.schemes,
      defaultMode: args.defaultMode ?? config.css?.defaultMode,
      minify: args.minify ?? config.css?.minify,
      banner: config.css?.banner,
    });
    const output = args.output ?? config.output;

    if (output) {
      const outputPath = resolve(process.cwd(), output);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, result.css, 'utf8');
      process.stderr.write(`Generated Aeris theme: ${outputPath}\n`);
    } else {
      process.stdout.write(result.css);
    }
  }
} catch (error) {
  if (error instanceof AerisThemeGenerationError) {
    process.stderr.write(`${error.message}\n`);
    for (const issue of error.issues) {
      const context = [issue.mode, issue.token].filter(Boolean).join(' / ');
      process.stderr.write(`- ${context ? `${context}: ` : ''}${issue.message}\n`);
    }
  } else {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  }
  process.exitCode = 1;
}

function parseArguments(values) {
  const result = {};

  for (let index = 0; index < values.length; index += 1) {
    const argument = values[index];
    if (argument === '--help' || argument === '-h') result.help = true;
    else if (argument === '--minify') result.minify = true;
    else if (argument === '--no-system') result.includeSystemMode = false;
    else if (argument === '--no-contrast-validation') result.validateContrast = false;
    else if (argument === '--preset') result.preset = requiredValue(values, ++index, argument);
    else if (argument === '--config') result.config = requiredValue(values, ++index, argument);
    else if (argument === '--derivation-version')
      result.derivationVersion = positiveIntegerValue(values, ++index, argument);
    else if (argument === '--output') result.output = requiredValue(values, ++index, argument);
    else if (argument === '--selector') result.selector = requiredValue(values, ++index, argument);
    else if (argument === '--schemes') result.schemes = requiredValue(values, ++index, argument);
    else if (argument === '--default-mode')
      result.defaultMode = requiredValue(values, ++index, argument);
    else throw new Error(`Unknown option "${argument}". Run aeris-theme --help for usage.`);
  }

  return result;
}

function requiredValue(values, index, option) {
  const value = values[index];
  if (!value || value.startsWith('--')) throw new Error(`${option} requires a value.`);
  return value;
}

function positiveIntegerValue(values, index, option) {
  const value = requiredValue(values, index, option);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${option} must be a positive integer.`);
  }
  return parsed;
}

async function readConfiguration(path) {
  const absolutePath = resolve(process.cwd(), path);
  const source = await readFile(absolutePath, 'utf8');
  const config = JSON.parse(source);
  if (!isRecord(config)) throw new Error('The theme configuration must contain a JSON object.');
  if (config.theme !== undefined && !isRecord(config.theme)) {
    throw new Error('The "theme" configuration value must be an object.');
  }
  if (config.css !== undefined && !isRecord(config.css)) {
    throw new Error('The "css" configuration value must be an object.');
  }
  if (
    config.derivationVersion !== undefined &&
    (!Number.isInteger(config.derivationVersion) || config.derivationVersion < 1)
  ) {
    throw new Error('The "derivationVersion" configuration value must be a positive integer.');
  }
  return config;
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
