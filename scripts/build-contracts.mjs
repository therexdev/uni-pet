import { spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
mkdirSync('public/contracts', { recursive: true });
const manifest = { version: 1, artifacts: {} };
for (const [name, target] of [
  ['contracts', 'core'],
  ['rewards', 'reward'],
]) {
  const result = spawnSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    [
      'exec',
      '--',
      'koinos-sdk-as-cli',
      'build-all',
      'release',
      '0',
      `${name}.proto`,
      '--generate_authorize',
    ],
    { cwd: 'contracts', stdio: 'inherit' },
  );
  if (result.status !== 0) process.exit(result.status || 1);
  copyFileSync(`contracts/abi/${name}-abi.json`, `public/contracts/${target}-abi.json`);
  copyFileSync('contracts/build/release/contract.wasm', `public/contracts/${target}.wasm`);
  copyFileSync('contracts/assembly/index.ts', `contracts/assembly/${target}-index.ts`);
  manifest.artifacts[target] = {
    sha256: createHash('sha256')
      .update(readFileSync(`public/contracts/${target}.wasm`))
      .digest('hex'),
    abi: `${target}-abi.json`,
    wasm: `${target}.wasm`,
  };
}
copyFileSync('contracts/assembly/core-index.ts', 'contracts/assembly/index.ts');
writeFileSync('public/contracts/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
