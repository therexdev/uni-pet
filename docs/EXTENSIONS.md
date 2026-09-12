# Build around Uni Pet

## Characters

A built-in character maps the same pet needs, emotions, and action events into SVG reactions. Sprout, Cloud, and Ember are reference implementations in `src/components/Pet.tsx`. Font and media files are bundled; core use does not require a third-party asset host.

The reference client's first community character interface accepts an image manifest:

```json
{
  "protocol": "uni-pet/v1",
  "name": "My community pet",
  "author": "Your community",
  "image": "https://your-own-domain.example/pet.png"
}
```

Paste it in **Change character → Bring a community character**. HTTPS images render through an image element. The client does not execute custom JavaScript, inject raw SVG markup, or load creator CSS. This interface is static artwork; richer animated packs can be implemented in another client or added through a reviewed pack format. If an image fails, the built-in character returns. Custom remote image requests disclose ordinary request metadata to their host.

A character pack cannot alter care, inventory, or affection. Publishing a manifest hash on-chain would identify its content, not guarantee availability of the underlying image.

## Independent clients

Use the committed ABI and any compatible RPC. Match the chain ID before signing. The sample CLI in `scripts/read-pet.mjs` and `scripts/care-pet.mjs` works without the reference website.

```js
import { Contract, Provider } from 'koilib';
const provider = new Provider(config.rpcUrls);
if ((await provider.getChainId()) !== config.chainId) throw new Error('Wrong chain');
const pet = new Contract({ id: config.contractId, abi, provider });
const { result } = await pet.functions.get_view({});
console.log(result.view);
```

For writes, attach a wallet signer and call `act` with the wallet address. Do not create a fake “connected” session or collect users' WIFs in a website. A custom frontend has exactly the same contract rules and daily limits as this one.

## Independent rewards

`contracts/assembly/Rewards.ts` is a working separate Care Club badge issuer. It stores its core contract identity at initialization, reads `get_period(address, week)`, requires at least three care days, authenticates the claimant, and records a unique nontransferable claim. It has its own ABI and WASM artifact.

No reward contract is called by the core care path. The issuer can fail or disappear without breaking care. The reference client checks that the issuer reports the configured core before displaying eligibility. A malicious issuer can lie about itself; clients must still curate issuers and examine code. The included issuer does not send tokens or promise monetary value.

To make a token campaign, build a separate contract with an explicitly funded budget, fixed asset contract, eligibility, claim period, unique claim keys, exhaustion rules, and a verified transfer path. Perform checks and claim accounting safely around external calls. A token campaign needs its own tests and review. Never copy a badge and merely add an unchecked token transfer.

For snapshots or arbitrary activity-based claims, retain the required summaries on-chain or specify a verifiable proof mechanism. Smart contracts do not automatically scan arbitrary old event logs.

## World modules

A module can read the pet and invoke public actions with proper wallet authority. Arbitrary creators cannot introduce fake food that the core accepts without an explicit rule. Version 1's garden and picnic are in the same core to keep the initial rules executable and coherent. New modules may maintain additional independent state. New core capabilities require a reviewed version and explicit migration plan.

## Distribution

Fork the client, replace the art, and point your public config at the same deployed core. Deploy to Hostinger, any static host, or run locally with a compatible node. Keep the chain ID and contract visible so people can distinguish a skin from a different creature.
