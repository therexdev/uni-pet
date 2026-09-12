# Release scope and validation

Uni Pet 0.1 is a runnable first implementation of the product vision. It starts in an explicitly labeled, device-local playground. No signed Koinos deployment has been performed. Website hosting alone does not make the pet shared or on-chain.

| Area           | Implemented                                                | Future work                                                       |
| -------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Care           | Four actions, needs, affection limits, basic traits        | Richer personality discovery                                      |
| Favorite Owner | Weekly bounded top-20 and persistent participation records | Winner gallery and separate category boards                       |
| Garden         | Three personal plots, watering, timed harvest, treats      | Shared plots, pantry and multiple crops                           |
| Community      | Picnic contributions and level milestones                  | Functional home upgrades, festivals and birthdays                 |
| Adventures     | One-hour berry trail and destination preferences           | Vote-driven branching adventures                                  |
| Characters     | Three animated SVG characters and custom HTTPS image       | Rich animation packs and discovery registry                       |
| Rewards        | Independent Care Club badge issuer                         | Third-party reward integrations; no token payout or marketplace   |
| Wallet         | Kondor integration and chain identity checks               | Verified live-wallet and mobile flows                             |
| History        | Last 20 events, retained weekly participation              | Full archive/indexer and paginated rankings                       |
| Sharing        | Downloadable moment cards and invite links                 | Notifications and referral attribution                            |
| Operations     | Static frontend, CLI, compiled WASM, tests                 | Signed testnet deployment, mana benchmarks and independent review |

## Validation boundaries

Automated coverage includes the local game model, core and reward contract behavior in the SDK mock VM, and a production-build browser walkthrough. Contract tests cover authority rejection, initialization, cooldowns, caps, weekly resets, timed harvests, eligibility, and duplicate claims. Browser checks cover gameplay, persistence, sharing, responsive navigation, and invalid configuration.

The SDK mock adapter copies byte arrays when storing objects. The upstream mock otherwise retains views into reusable WebAssembly memory; copying models persistent chain storage without changing contract checks. These are mock tests, not evidence of a successful live transaction or security audit.

## Before public on-chain launch

Deploy and verify on Harbinger, run live Kondor transactions, test two independent clients, measure mana and sponsorship depletion, inspect authority flags, and review contract logic independently before freezing. See DEPLOYMENT.md. No credentials have been supplied or embedded.

## Known limitations

Wallet limits do not establish unique human identity. Coordinated wallets can influence scores and preferences. Per-action work is bounded, but stored owners and weekly records grow over time. Destination votes express preferences and do not yet change adventure outcomes. Care Club badges are records in the reference issuer, not an NFT standard. Configuration freeze labels must be checked against chain metadata. Historical badge claims are available through the reward ABI; the initial UI focuses on the current week. Local playground data is a preview and is not migrated to the chain.
