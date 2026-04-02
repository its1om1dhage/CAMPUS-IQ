const { spawnSync } = require('child_process');
const fs = require('fs');
const r = spawnSync('node', ['node_modules/.bin/vite', 'build'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 50,
  timeout: 120000,
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});
fs.writeFileSync('build_result.txt', 
  'STATUS: ' + r.status + '\n' +
  'STDOUT:\n' + (r.stdout || '') + '\n' +
  'STDERR:\n' + (r.stderr || '') + '\n' +
  'ERROR: ' + (r.error ? r.error.message : 'none') + '\n'
, 'utf8');
console.log('Done - check build_result.txt');
