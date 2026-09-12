# Koinos contract deployment

## What is and is not deployed

The repository contains source, compiled artifacts, and deployment tools. No chain deployment is configured initially. Website publishing is separate from deploying the core and optional badge issuer.

## Prepare locally

1. Install Node 22.12+ or 24. Run `npm ci` and `npm ci --prefix contracts`.
2. Run `npm run contracts:build`, `npm run contracts:test`, and `npm test`.
3. Select a reachable Harbinger RPC. Retrieve its current chain ID and verify the endpoint. Harbinger can reset; do not reuse a historical ID blindly.
4. Create a dedicated deployment wallet locally with your wallet software. Acquire test KOIN for its mana. Use a separate wallet for the badge issuer. Do not deploy contracts to a personal spending wallet.
5. Copy `.env.example` to `.env`. Set the RPC, verified chain ID, network label, and dedicated deployment wallet WIF locally. This file is ignored by Git. Do not paste the key into chat or Hostinger.

The testnet guide describes requesting tKOIN through the Koinos community faucet. Faucet availability and endpoints must be verified at deployment time: [Koinos testnet guide](https://docs.koinos.io/developers/testnet/).

## Deploy the core

```sh
node --env-file=.env scripts/deploy-contract.mjs core
```

The script checks the expected chain ID and compiled artifact hash, creates upload and initialization in one transaction, waits for inclusion, reads the pet back, and updates only the public config. It prints the address and transaction ID, never the WIF.

A default test deployment is **replaceable** while testing. The UI identifies that policy. Before an immutable launch, perform independent review and real-network testing, then use a fresh dedicated contract account with `--freeze`. This installs the contract's upload authorization hook, which denies replacement. The chain's consensus and governance still underlie these guarantees.

Mainnet requires `UNIPET_DEPLOY_NETWORK=mainnet`, a verified mainnet chain ID, and the explicit `--mainnet` argument. No production readiness or mana estimate is implied by a passing mock test suite. This initial version should not be frozen on mainnet before the open items in RELEASE_STATUS.md are addressed.

The script intentionally refuses to replace an already configured core. A new version or new pet should be prepared in a separate checkout with an explicit identity and migration decision. Never point a public client to a different creature silently.

## Optional badge issuer

Change the local deployment WIF to a **different** dedicated account on the same network. Keep the configured core.

```sh
node --env-file=.env scripts/deploy-contract.mjs reward
```

The issuer is initialized with the existing core ID. Its address and declared freeze status are added to public configuration. Run the site's reward flow only after three real care days have been recorded. You can also read historical weekly status and claim using the reward ABI.

## Publish the configuration

Run `npm run build`. Commit `public/uni-pet.config.json` and any changed verified artifacts; push to GitHub and let Hostinger build the new frontend. Do not commit `.env`, keys, or a private RPC API credential. A browser RPC URL is public.

## Verify on the actual chain

- Inspect the upload transaction, initialized state, bytecode hash, and authority flags.
- Check feed, comfort, rejection after cooldown, day/week changes, and real wallet rejection handling.
- Measure resource consumption for new and returning owners, dense leaderboards, garden operations, and claims.
- Test sponsor depletion and an alternate payer if you configure a sponsor.
- Open two independent clients and confirm identical pet state after a signed action.
- Verify the same reads and a signed action with the original site stopped.

```sh
node scripts/read-pet.mjs
node --env-file=.env scripts/care-pet.mjs comfort
```

The care script uses a separate `UNIPET_PLAYER_WIF`, read only from your local environment. The website never uses this variable.

Inclusion is not irreversible finality. The client waits for inclusion and re-reads state; production rewards with value should use an explicit irreversible-block policy. Keep deployment records and do not re-submit a transaction blindly when a confirmation request times out.

## Mana sponsorship

The frontend supports an optional existing `sponsorAddress`. That account must have an appropriately constrained on-chain payer authorization policy and available mana. Leaving it blank uses the player's own mana. No sponsor is fabricated, funded, or operated by this repository. Hosting the frontend does not pay for on-chain resources.

Sources: [Koinos payer semantics](https://docs.koinos.io/developers/payer-payee/), [Koinos immutable contract guide](https://docs.koinos.io/developers/guides/immutable/). Deployment mechanics use the installed Koilib contract API and the generated ABI.
