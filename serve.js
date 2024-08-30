// @ts-check
// Do not run this file directly. See package.json for more info.
import { spawn } from 'node:child_process';
import { HTTP_PORT } from './settings.js';

/**
 *
 * @param {string} program
 * @param {string[]} args
 * @returns {ReturnType<typeof spawn>}
 */
function cmd(program, args = []) {
  const spawnOptions = { shell: true };
  console.log('CMD:', program, args.flat(), spawnOptions);
  const p = spawn(program, args.flat(), spawnOptions); // NOTE: flattening the args array enables you to group related arguments for better self-documentation of the running command
  p.stdout.on('data', (data) => process.stdout.write(data));
  p.stderr.on('data', (data) => process.stderr.write(data));
  p.on('close', (code) => {
    if (code !== 0) {
      console.error(program, args, 'exited with', code);
    }
  });
  return p;
}

cmd('node', ['--watch', 'server.js']);
cmd('http-server', ['-p', `${HTTP_PORT}`, '-a', '127.0.0.1', '-s', '-c-1', '-d', 'false', '-o']);
