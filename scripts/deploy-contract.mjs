import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Provider, Signer, Contract } from 'koilib';
// Run locally. Never send this WIF to a frontend, CI, Hostinger, or another person.
const target = process.argv[2] || 'core';
if (!['core', 'reward'].includes(target)) throw new Error('Choose core or reward.');
const rpc = process.env.KOINOS_RPC,
  expected = process.env.KOINOS_CHAIN_ID,
  wif = process.env.UNIPET_DEPLOY_WIF,
  network = process.env.UNIPET_DEPLOY_NETWORK || 'harbinger';
if (!rpc || !expected || !wif)
  throw new Error('Set KOINOS_RPC, KOINOS_CHAIN_ID, and UNIPET_DEPLOY_WIF in a local .env file.');
if (!['harbinger', 'mainnet'].includes(network)) throw new Error('Choose harbinger or mainnet.');
if (network === 'mainnet' && !process.argv.includes('--mainnet'))
  throw new Error(
    'Mainnet requires the explicit --mainnet flag after review and testnet validation.',
  );
const provider = new Provider(rpc);
const chainId = await provider.getChainId();
if (chainId !== expected) throw new Error('Chain ID mismatch. Nothing was sent.');
const signer = Signer.fromWif(wif);
signer.provider = provider;
const id = signer.getAddress();
const configPath = 'public/uni-pet.config.json';
const config = JSON.parse(readFileSync(configPath, 'utf8'));
if (target === 'core' && config.mode === 'chain' && config.contractId)
  throw new Error('A core is already configured. Use a separate checkout to deploy another pet.');
if (
  target === 'reward' &&
  (!config.contractId || config.chainId !== chainId || config.contractId === id)
)
  throw new Error(
    'Configure the core first, on this chain, then use a different deployment wallet for the reward issuer.',
  );
const artifact = readFileSync(`public/contracts/${target}.wasm`),
  manifest = JSON.parse(readFileSync('public/contracts/manifest.json', 'utf8'));
if (createHash('sha256').update(artifact).digest('hex') !== manifest.artifacts[target].sha256)
  throw new Error('Artifact integrity check failed. Rebuild contracts.');
const abi = JSON.parse(readFileSync(`public/contracts/${target}-abi.json`, 'utf8'));
const contract = new Contract({ id, abi, provider, signer, bytecode: artifact });
const { operation: initialize } = await contract.functions.initialize(
  target === 'reward' ? { core: config.contractId } : {},
  { onlyOperation: true },
);
if (!initialize) throw new Error('Failed to prepare initialization.');
// Default testnet deployments remain replaceable for bug fixes. --freeze disables
// contract replacement at upload. Core gameplay itself has no privileged edits.
const frozen = process.argv.includes('--freeze');
console.log(
  `Deploying ${target} to ${network}: ${id} (${frozen ? 'immutable upload policy' : 'replaceable test deployment'})`,
);
const result = await contract.deploy({
  abi: JSON.stringify(abi),
  authorizesUploadContract: frozen,
  authorizesCallContract: false,
  authorizesTransactionApplication: false,
  nextOperations: [initialize],
  chainId,
  sendTransaction: true,
  signTransaction: true,
});
if (result.receipt?.reverted)
  throw new Error(result.receipt.logs?.join('\n') || 'Deployment reverted.');
if (!result.transaction?.id) throw new Error('No deployment transaction returned.');
console.log('Submitted transaction:', result.transaction.id);
await provider.wait(result.transaction.id, 'byBlock', 120000);
if (target === 'core') {
  const check = await contract.functions.get_view({});
  if (check.result?.view?.pet?.name !== 'Uni')
    throw new Error('Deployed state verification failed.');
  config.mode = 'chain';
  config.contractId = id;
  config.rpcUrls = [rpc];
  config.chainId = chainId;
  config.network = network;
  config.coreFrozen = frozen;
} else {
  config.rewardContractId = id;
  config.rewardFrozen = frozen;
}
writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
console.log(
  `Verified ${target}. Public configuration updated. Rebuild the web app and commit only the public configuration. Keep .env private.`,
);
