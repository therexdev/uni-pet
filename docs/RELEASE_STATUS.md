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

## Playful mobile interface update

Phone screens use a continuous character-colored background, compact controls, floating navigation, and a mounted page track that follows horizontal touch movement. Inactive pages are inert and hidden from assistive technology. Vertical gestures scroll; pet touch zones respond independently. Reduced-motion preferences disable sliding and character motion.

Head strokes, belly tickles, and boops are cosmetic client reactions, without protocol writes or affection points. Feed/play/clean/comfort remain the authoritative care actions; successful feeding delivers a snack and animates chewing. During a chain request, the UI immediately acknowledges the tap and reports wallet approval and inclusion separately. Confirmation ends the action lock; a slow state read no longer keeps every action button disabled. Public reads fetch pet and owner together and have bounded timeouts. A submitted transaction timeout retains its ID and is never automatically retried.

A first care action continues after connecting, so it does not require a second tap. Dismissing the connection dialog cancels that queued action. Mocked gateway tests cover progress phases, wallet rejection, and inclusion timeout. Browser checks cover real pointer-driven page movement, touch reactions, food artwork, immediate cooldown errors, first-action continuation, and phone/desktop layouts. These checks do not establish live-chain latency.

## Family-care revision

Adds a five-action local queue, automatic fading errors visible on desktop and phone, shared-state activity/favorite notices, an introductory family bubble, larger mobile labels and stronger card/leaderboard contrast. The core now uses block heights for needs and includes healthy meals, gentle guidance, affection deductions, balanced level requirements, distinct-caretaker counts and a full ordered ranking index. Source, ABI and compiled core must be deployed together to a fresh contract; existing contract behavior does not change from a frontend push. No signed deployment or live multi-user trial has been performed.

The expanded ranking regression also exposed the SDK’s default 1 KiB response buffer: a fuller recent-event log could exceed it. The core now explicitly allocates 16 KiB for system-call responses, and the 21-caretaker regression exercises the full log and ranking replacement together.
