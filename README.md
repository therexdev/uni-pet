# Uni Pet

**The pet for U n I.** One shared creature. Independent characters, interfaces, and community rewards. Built for Koinos, with a portable React frontend ready for Hostinger Web App Hosting.

## What is included

- Animated Sprout, Cloud, and Ember characters, plus an HTTPS image manifest for community characters.
- Feeding, playing, cleaning, and cuddling; needs derived from chain time.
- Weekly Favorite Humans leaderboard, daily affection limits, and persistent friendship records.
- Three personal garden plots, timed crops, watering, berry crafting, and a shared picnic project.
- One-hour berry adventures, community destination preferences, level milestones, and a recent activity journal.
- Independent Care Club badge contract that checks the core's retained care-day records.
- Kondor wallet integration, network identity checks, explicit transaction errors, and separate local playground mode.
- Downloadable share cards, mobile layout, keyboard-accessible dialogs, and reduced-motion support.
- Compiled WebAssembly contracts, generated ABIs, deployment scripts, tests, and extension documentation.

## Deployment status

This initial repository **starts in local playground mode**. It is a working, device-local way to try the UI. It is not a deployed Koinos pet, does not synchronize between visitors, and does not award real blockchain assets.

The core and badge contracts compile and have automated tests. A signed chain deployment, live wallet verification, and measured mana capacity are still required before public on-chain play. No contract address or live deployment is fabricated. Hostinger deployment of the website alone does not deploy a Koinos contract.

See [Hostinger setup](docs/HOSTINGER.md) to publish the web app, then [contract deployment](docs/DEPLOYMENT.md) to activate one shared pet. Use testnet first. See [release scope and remaining work](docs/RELEASE_STATUS.md) before treating this as the full long-term product.

## Run locally

Use Node 22.12+ or Node 24.

```sh
npm ci
npm run dev
```

Create the production build and serve it locally:

```sh
npm run build
npm start
```

The app is at `http://localhost:3000` when using `npm start`. The production `dist/` folder is also a complete static site. The optional server only serves files; it has no game database, wallet keys, or game logic.

## Validate and build contracts

```sh
npm ci --prefix contracts
npm run contracts:build
npm run contracts:test
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

`contracts:build` produces `public/contracts/core.wasm`, `reward.wasm`, their ABIs, and a SHA-256 manifest. These artifacts are committed so a Hostinger web build does not need the separate AssemblyScript toolchain. Rebuild and commit them whenever contract source changes.

`npm run check` runs model tests, the frontend build, contract builds, and contract tests. Browser checks run against the production build and start their own temporary static server.

## Configuration

`public/uni-pet.config.json` is public. It contains mode, chain identity, RPC URLs, core and optional reward addresses, optional external sponsor address, and declared freeze status. **Never put a private key or a secret API key in that file.** The client refuses an incomplete chain configuration instead of silently entering playground mode.

All authoritative game rules and state live in the Koinos contracts in chain mode. Local storage contains only playground data and visual preferences. Media is bundled for the built-in characters and fonts. A custom HTTPS character is optional and can fall back to a built-in character.

## Read more

- [Product specification](docs/PRODUCT_SPEC.md)
- [On-chain rules and storage](docs/PROTOCOL.md)
- [Characters, clients, and rewards](docs/EXTENSIONS.md)
- [Hostinger deployment](docs/HOSTINGER.md)
- [Koinos deployment and independent operation](docs/DEPLOYMENT.md)
- [Release scope and validation](docs/RELEASE_STATUS.md)
- [Security boundaries](SECURITY.md)

MIT licensed. Third-party dependencies retain their own licenses. Uni Pet artwork in this repository is original SVG source; the bundled fonts retain their SIL Open Font License.
