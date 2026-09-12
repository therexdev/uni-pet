import type { Config } from './types';
export async function loadConfig(): Promise<Config> {
  const response = await fetch('/uni-pet.config.json', {
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Uni Pet configuration could not be loaded.');
  const c = (await response.json()) as Config;
  if (!['playground', 'chain'].includes(c.mode)) throw new Error('Invalid app mode.');
  if (c.mode === 'chain') {
    if (!c.contractId || !c.chainId || !Array.isArray(c.rpcUrls) || !c.rpcUrls.length)
      throw new Error('The on-chain pet has not been configured yet.');
    for (const url of c.rpcUrls) {
      const u = new URL(url);
      if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1')
        throw new Error('RPC must use HTTPS.');
    }
  }
  return c;
}
