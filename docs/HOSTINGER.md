# Hostinger deployment

Hostinger hosts a replaceable frontend. Koinos hosts the authoritative game once its contracts are deployed. There is no application database to create.

## Import this repository

In hPanel, select **Websites → Add Website → Deploy Web App → Import Git Repository**. Choose `therexdev/uni-pet`, branch `main`.

Use these settings:

| Setting                  | Value                          |
| ------------------------ | ------------------------------ |
| Framework                | Vite / React frontend          |
| Root directory           | Repository root                |
| Node version             | 22 or 24                       |
| Install command if shown | `npm ci --include=dev`         |
| Build command            | `npm run build`                |
| Output directory         | `dist`                         |
| Environment variables    | None needed for the playground |

The committed public contract artifacts are copied to `dist/contracts` by Vite. Do not run `contracts:build` as the Hostinger web build; build contracts locally and commit the verified artifacts.

If you choose Hostinger's **Other / Node application** option instead of static Vite hosting, use the same build command and `npm start`, with entry file `server.mjs`. The server listens on Hostinger's supplied `PORT` and binds to `0.0.0.0`. It serves only `dist/`, including SPA fallbacks, and does not store game state.

## Activate the shared pet

The initial deployment opens in an explicitly labeled playground. Complete [Koinos deployment](DEPLOYMENT.md), then commit the public configuration produced by the deployment script and let Hostinger rebuild. Confirm the banner names Koinos testnet or mainnet rather than the playground.

Check the configured RPC allows browser requests from your domain. Never solve CORS by exposing a private key or adding a private game server. A public CORS-enabled node, an independently hosted compatible RPC, or your own Koinos node is sufficient.

## Check after publishing

1. Open the site on desktop and a phone. The pet, garden, navigation, and dialogs should fit without horizontal scrolling. On phones, tap the five bottom tabs or swipe horizontally through the content. Vertical gestures should scroll normally; swiping should not submit a care action or navigate behind an open dialog.
2. In playground mode, join, feed Uni, and confirm the local leaderboard changes.
3. In chain mode, verify the contract ID and chain against your deployment record, connect Kondor, and make one signed care action.
4. Open a second client against the same chain and contract. Confirm both show the same result.
5. Refresh and check that the new configuration is served. `uni-pet.config.json` must not remain stale in a CDN cache.

On mobile without the Kondor extension, this release supports viewing. Do not expect wallet signing to work in a browser that does not support Kondor.

## Update and rollback

Hostinger's GitHub integration can rebuild on pushes. Roll back frontend changes by selecting a prior deployment or reverting a Git commit. Frontend rollback does not reverse on-chain transactions. Contract upgrades and migration are separate operations governed by the deployed authority policy.

Hostinger account access and domain selection are performed in your hPanel. No Hostinger site was created by adding this repository.

Source: [Hostinger Node.js web app setup](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), consulted 12 September 2026. Hostinger documents GitHub import, Vite/React support, build/output settings, and supported Node versions. Panel labels can change.
