import { Contract, Provider } from 'koilib';
import type { Abi } from 'koilib';
import * as kondor from 'kondor-js';
import type { Config, Gateway, Action, View, Owner } from './types';
import { emptyOwner } from './types';
function deadline<T>(promise: Promise<T>, ms = 30000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          new Error(
            'The wallet or network did not respond. Check your wallet before trying again.',
          ),
        ),
      ms,
    );
    promise.then(
      (x) => {
        clearTimeout(timer);
        resolve(x);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}
export class Chain implements Gateway {
  provider: Provider;
  config: Config;
  abi: Abi | null = null;
  rewardAbi: Abi | null = null;
  constructor(config: Config) {
    this.config = config;
    this.provider = new Provider(config.rpcUrls);
  }
  async ready() {
    if ((await deadline(this.provider.getChainId(), 10000)) !== this.config.chainId)
      throw new Error('RPC chain does not match the configured pet. No transaction was sent.');
    if (!this.abi) {
      const r = await fetch('/contracts/core-abi.json', { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error('Contract interface missing.');
      this.abi = await r.json();
    }
  }
  core(address?: string) {
    return new Contract({
      id: this.config.contractId,
      abi: this.abi!,
      provider: this.provider,
      signer: address ? new kondor.KondorSigner({ address, provider: this.provider }) : undefined,
    });
  }
  async read(address?: string) {
    await this.ready();
    const contract = this.core();
    const [v, ownerResult] = await Promise.all([
      deadline(contract.functions.get_view({}), 12000),
      address ? deadline(contract.functions.get_owner({ address }), 12000) : Promise.resolve(null),
    ]);
    if (!v.result?.view) throw new Error('The pet contract returned no state.');
    const view = v.result.view as View;
    view.events ??= [];
    view.board.entries ??= [];
    view.pet.votes ??= [0, 0, 0];
    let owner: Owner | null = null;
    if (address) {
      const raw = ownerResult?.result?.owner as Partial<Owner>;
      owner = { ...emptyOwner(address, Number(view.time)), ...raw };
      owner.plots = (raw?.plots || owner.plots).map((p) => ({
        planted: p.planted || '0',
        watered: !!p.watered,
        crop: p.crop || 0,
      }));
    }
    return { view, owner };
  }
  async connect() {
    await this.ready();
    const accounts = await deadline(kondor.getAccounts());
    if (!accounts.length) throw new Error('No wallet account selected.');
    return accounts[0].address;
  }
  async send(
    address: string,
    method: string,
    args: Record<string, unknown>,
    reward = false,
    progress?: (message: string) => void,
  ) {
    await this.ready();
    const contract = reward ? await this.reward(address) : this.core(address);
    const options = this.config.sponsorAddress
      ? { payer: this.config.sponsorAddress, payee: address }
      : {};
    progress?.('Approve the request in your wallet…');
    const response = await deadline(
      contract.functions[method](args, { ...options, sendTransaction: true }),
      120000,
    );
    if (response.receipt?.reverted)
      throw new Error(response.receipt.logs?.join('\n') || 'Transaction reverted.');
    const tx = response.transaction;
    if (!tx?.id) throw new Error('Wallet did not return a transaction.');
    progress?.('Submitted. Waiting for Koinos confirmation…');
    try {
      await this.provider.wait(tx.id, 'byBlock', 60000);
    } catch {
      throw new Error(
        `Transaction ${tx.id} was submitted, but confirmation is pending. Refresh before repeating the action.`,
      );
    }
    return tx.id;
  }
  async act(address: string, a: Action, progress?: (message: string) => void) {
    return this.send(
      address,
      'act',
      {
        address,
        ...a,
        slot: a.slot ?? 0,
        choice: a.choice ?? 0,
        min_points: a.min_points ?? 0,
      },
      false,
      progress,
    );
  }
  async settle(week: number) {
    const address = await this.connect();
    return this.send(address, 'settle', { week });
  }
  async reward(address?: string) {
    if (!this.config.rewardContractId)
      throw new Error('No reward campaign is connected to this pet yet.');
    if (!this.rewardAbi) {
      const r = await fetch('/contracts/reward-abi.json', { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error('Reward interface missing.');
      this.rewardAbi = await r.json();
    }
    return new Contract({
      id: this.config.rewardContractId,
      abi: this.rewardAbi!,
      provider: this.provider,
      signer: address ? new kondor.KondorSigner({ address, provider: this.provider }) : undefined,
    });
  }
  async rewardStatus(address: string, week: number) {
    await this.ready();
    const r = await (await this.reward()).functions.status({ address, week });
    if (r.result?.core !== this.config.contractId)
      throw new Error('This reward issuer belongs to a different pet.');
    return { claimed: !!r.result?.claimed, eligible: !!r.result?.eligible };
  }
  async claim(address: string, week: number, progress?: (message: string) => void) {
    return this.send(address, 'claim', { address, week }, true, progress);
  }
}
