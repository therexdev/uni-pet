import { readFileSync } from 'node:fs';
import { Provider, Contract } from 'koilib';
const config = JSON.parse(readFileSync('public/uni-pet.config.json', 'utf8'));
if (config.mode !== 'chain') throw new Error('Deploy and configure an on-chain pet first.');
const provider = new Provider(config.rpcUrls);
if ((await provider.getChainId()) !== config.chainId) throw new Error('Chain ID mismatch');
const contract = new Contract({
  id: config.contractId,
  provider,
  abi: JSON.parse(readFileSync('public/contracts/core-abi.json', 'utf8')),
});
console.log(JSON.stringify((await contract.functions.get_view({})).result, null, 2));
