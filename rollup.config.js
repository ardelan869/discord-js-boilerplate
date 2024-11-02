import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { del } from '@kineticcafe/rollup-plugin-delete';

import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

function getFiles(dir) {
  return readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...getFiles(name)] : [...files, name];
  }, []);
}

const inputs = getFiles('src')
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .reduce((acc, file) => {
    const name = relative('src', file).replace('.ts', '');
    acc[name] = file;
    return acc;
  }, {});

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

const external = [
  'discord.js',
  'dotenv',
  'zod',
  'node:*',
  /.*\.json$/,
  /node_modules/,
  /node_modules\/.*/,
  ...Object.keys({
    ...(packageJson.peerDependencies || {}),
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  })
];

export default {
  input: inputs,
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: false,
  },
  plugins: [
    del({ targets: 'dist/*' }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    typescript({
      sourceMap: false,
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
      noEmitOnError: false,
    }),
  ],
  external
};
