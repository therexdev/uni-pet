import { readFileSync } from 'node:fs';
import { Provider, Signer, Contract } from 'koilib';
const config = JSON.parse(readFileSync('public/uni-pet.config.json', 'utf8'));
if (config.mode !== 'chain' || !process.env.UNIPET_PLAYER_WIF)
  throw new Error('Configure a chain pet and set a local UNIPET_PLAYER_WIF first.');
const provider = new Provider(config.rpcUrls);
if ((await provider.getChainId()) !== config.chainId) throw new Error('Chain ID mismatch');
const signer = Signer.fromWif(process.env.UNIPET_PLAYER_WIF);
signer.provider = provider;
const core = new Contract({
  id: config.contractId,
  provider,
  signer,
  abi: JSON.parse(readFileSync('public/contracts/core-abi.json', 'utf8')),
});
const kind = process.argv[2] || 'comfort';
if (!['feed', 'play', 'clean', 'comfort'].includes(kind))
  throw new Error('Choose feed, play, clean, or comfort.');
const result = await core.functions.act(
  { address: signer.getAddress(), kind, min_points: 0 },
  { sendTransaction: true },
);
if (result.receipt?.reverted) throw new Error(result.receipt.logs?.join('\n') || 'Action reverted');
console.log('Submitted:', result.transaction?.id);
if (result.transaction?.id) await provider.wait(result.transaction.id, 'byBlock', 60000);
console.log(JSON.stringify((await core.functions.get_view({})).result, null, 2));
