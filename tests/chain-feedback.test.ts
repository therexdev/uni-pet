import { beforeEach, describe, expect, it, vi } from 'vitest';
const rpc = vi.hoisted(() => ({ chain: vi.fn(), wait: vi.fn(), act: vi.fn() }));
vi.mock('koilib', () => ({
  Provider: class {
    getChainId = rpc.chain;
    wait = rpc.wait;
  },
  Contract: class {
    functions = { act: rpc.act };
  },
}));
vi.mock('kondor-js', () => ({ KondorSigner: class {} }));
import { Chain } from '../src/lib/chain';
const config = {
  mode: 'chain',
  network: 'harbinger',
  rpcUrls: ['https://example.com'],
  chainId: 'test-chain',
  contractId: 'core',
  rewardContractId: '',
  sponsorAddress: '',
  coreFrozen: false,
  rewardFrozen: false,
} as const;
describe('transaction feedback', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    rpc.chain.mockResolvedValue('test-chain');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
  });
  it('announces signing and confirmation separately and remains pending until inclusion', async () => {
    let signed!: (value: unknown) => void, included!: () => void;
    rpc.act.mockImplementation(
      () =>
        new Promise((r) => {
          signed = r;
        }),
    );
    rpc.wait.mockImplementation(
      () =>
        new Promise<void>((r) => {
          included = r;
        }),
    );
    const phases: string[] = [];
    const chain = new Chain({ ...config, rpcUrls: [...config.rpcUrls] });
    let finished = false;
    const pending = chain
      .act('player', { kind: 'feed' }, (message) => phases.push(message))
      .then(() => {
        finished = true;
      });
    await vi.waitFor(() => expect(phases).toEqual(['Approve the request in your wallet…']));
    expect(finished).toBe(false);
    signed({ transaction: { id: 'tx-one' }, receipt: { reverted: false } });
    await vi.waitFor(() => expect(phases).toHaveLength(2));
    expect(phases[1]).toContain('Waiting for Koinos confirmation');
    expect(finished).toBe(false);
    included();
    await pending;
    expect(finished).toBe(true);
    expect(rpc.act).toHaveBeenCalledTimes(1);
  });
  it('reports a wallet rejection without pretending a transaction was submitted', async () => {
    rpc.act.mockRejectedValue(new Error('Request declined in wallet'));
    const chain = new Chain({ ...config, rpcUrls: [...config.rpcUrls] });
    await expect(chain.act('player', { kind: 'feed' })).rejects.toThrow('Request declined');
    expect(rpc.wait).not.toHaveBeenCalled();
  });
  it('keeps the submitted transaction ID in a confirmation timeout and never retries it', async () => {
    rpc.act.mockResolvedValue({ transaction: { id: 'tx-pending' } });
    rpc.wait.mockRejectedValue(new Error('timeout'));
    const chain = new Chain({ ...config, rpcUrls: [...config.rpcUrls] });
    await expect(chain.act('player', { kind: 'feed' })).rejects.toThrow(
      'Transaction tx-pending was submitted',
    );
    expect(rpc.act).toHaveBeenCalledTimes(1);
  });
});
