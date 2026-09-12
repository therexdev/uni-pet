# Uni Pet — The pet for U n I

This is the long-term product specification from the planning document. For what version 0.1 implements today, see [release scope](RELEASE_STATUS.md). This document is a vision, not a claim of completed deployment.

Version 1.0 • 12 September 2026 • Working product name

### Product vision

We will build a shared virtual creature that lives through smart contracts on Koinos. People care for it together, shape its personality, earn its affection, and build a world around it. Its Favorite Owner and other relationships give the community a friendly, personal reason to return.

The product is an open game protocol. Its identity, rules, meaningful actions, relationships, possessions, and progression belong on-chain. Anyone can display the same creature as their own character, build an alternative interface, or attach an independent reward system without our permission.

### The central product promise

If the original team and website disappear, the same pet remains usable through another client. Its continued operation must not depend on a company database, proprietary API, hosted scheduler, private game engine, or discretionary administrator.

A person may see a cat, another a robot, and another a dragon. When they connect to the same chain, core contract, and pet ID, they care for the same underlying creature. A new skin does not create a new pet or reset its relationships.

### What this document defines

This specification covers the intended complete product: care, relationships, shared activities, gardens, adventures, character overlays, rewards, developer interfaces, resource sustainability, and acceptance criteria. Delivery can be staged without reducing the long-term scope.

The protocol direction reflects the agreed concept. Detailed mechanics below are proposed implementation defaults, not claims of deployed functionality. Numeric balance values, resource budgets, branding, and exact contract interfaces must be validated before mainnet deployment.

### Technical meaning of independent operation

No dedicated game hosting or official frontend is required for the core rules to operate. Koinos nodes must still run, and someone needs a wallet, command-line tool, or visual client to interact. The chain does not draw animations or send notifications. Contracts execute when invoked; time-based needs are derived from chain time and settled by transactions when needed.

## The shared pet experience

The opening experience is a living scene centered on the pet. A visitor can watch without connecting a wallet. Connecting reveals their relationship, useful care actions, community goals, and any optional rewards they have chosen to join.

### A normal visit

The player sees how the pet feels and what it needs, chooses an action, signs it, and watches a reaction after confirmation. The interface explains the resulting care change and affection earned. A short visit should feel complete; longer play is optional.

| Action  | Purpose                                   | Pet response                                   |
| ------- | ----------------------------------------- | ---------------------------------------------- |
| Feed    | Restore nourishment with an eligible food | Eats, enjoys a favorite, or makes a funny face |
| Play    | Improve happiness while using energy      | Chases a toy, dances, or celebrates            |
| Clean   | Restore cleanliness                       | Splashes, shakes itself dry, or relaxes        |
| Comfort | Help when lonely or upset                 | Leans closer, cuddles, or settles down         |
| Rest    | Allow energy to recover over time         | Sleeps and later wakes ready to play           |

### Needs and useful participation

Nourishment, happiness, cleanliness, and energy use bounded values with published rates. Mood is a deterministic interpretation of those values and recent events. Actions cannot increase meters without limit. Useful care earns more recognition than repeating an action the pet does not need.

The pet must remain enjoyable at both low and high participation. Shared projects and personal relationship activities give players something useful to do when basic needs are already satisfied. These activities have their own caps and cannot become an unlimited affection shortcut.

### Kindness without pressure

Absence makes the pet sleepy, scruffy, or less energetic. It never permanently dies from neglect, loses its identity, or destroys someone’s possessions. Returning players can help immediately. There are no punishments for missing a streak and no paid rescue requirement.

### Transaction feedback

Show pending, confirmed, and failed states clearly. A hopeful animation may play immediately, but inventory and affection must not be presented as final until confirmed. If another player satisfies the need first, the contract respects the caller’s minimum expected benefit or rejects without consuming the item. Network resource use can still occur for failed transactions.

## Favorite Owners and relationships

The social centerpiece is “My Favorite Humans.” Favorite Owner is an affectionate title; it grants no custody of the pet, administrative authority, or control over other players. The pet remains a shared creature.

### A fair and understandable competition

Use a weekly Favorite Owner competition at launch. The current leader gets the special greeting during that week; the final winner receives a permanent historical badge. Each new week starts a fresh competition, while lifetime friendship records remain. This avoids requiring a continuously decaying global ranking.

Proposed scoring starts with a useful-care value, adds a small daily variety bonus, and applies per-action and total daily limits. Time boundaries come from chain time. Buying items, switching skins, funding mana, or participating in an external reward campaign never directly multiplies core affection.

Publish the scoring explanation in plain language and expose the values through contract reads. Every accepted scoring action records its points and category. Ties use the earliest transaction to reach the tied score, with chain operation order and then address as deterministic fallbacks.

| Relationship   | Recognition basis                                  |
| -------------- | -------------------------------------------------- |
| Favorite Owner | Highest capped affection score in the current week |
| Best Playmate  | Capped qualifying play contribution                |
| Comfort Person | Capped comfort contribution when appropriate       |
| Favorite Chef  | Useful feeding and recognized recipe discoveries   |
| Old Friend     | Lifetime count of distinct qualifying care days    |

### How the bond becomes visible

A connected favorite receives an excited greeting. Familiar people get warmer reactions as their friendship grows. The interface can show “He remembers you helping at his first birthday” using a real milestone record. Character packs choose the expression; the underlying relationship remains verifiable.

### Rankings without hidden computation

Maintain bounded weekly leaderboards and per-wallet counters on-chain. Because weekly scores only increase, a top list can be updated after each scoring action without rescanning every player. Close and archive a week permissionlessly after its deadline. Anyone can trigger closure; reward claims can trigger it too. Full rankings are reconstructed from paginated records or public history.

One wallet is not proof of one human. Daily caps limit a wallet, not a determined multi-wallet operator. The core must describe this honestly. Monetary campaigns need their own stronger eligibility rules and must not redefine the shared Favorite Owner result.

## Personality and community moments

### A creature shaped by its community

Personality tracks a small set of bounded traits such as playfulness, affection, curiosity, and mischief. Qualifying activities influence those traits gradually, with global rate limits so a sudden burst cannot completely change the pet. Traits affect published preferences, reactions, and eligible activities.

Personality and mood are separate. The pet may be naturally curious but sleepy today. Character packs map these same traits into their own gestures and dialogue. Flavor text cannot silently introduce a new authoritative game fact.

### Memorable discoveries

The pet can develop a favorite toy, react dramatically to a food, learn a trick, and reach a new life stage. Discoveries unlock records that everyone can inspect. Recipes and reactions can be discoverable through experimentation, but on-chain data is public: apparent surprises are not guaranteed secrets.

Evolution preserves the pet ID, friendship, belongings, and history. A milestone and a community choice can determine the next stage. A robot skin might gain a new antenna while a dragon skin grows wings; both reflect the same evolution state.

### Cooperative activities

- Build a home feature by contributing capped effort or eligible materials toward a shared target. Completion unlocks a usable feature for everyone.

- Hold a birthday or costume celebration with a published participation window, community choice, and commemorative badge.

- Run asynchronous group play, where short contributions fill a shared goal. Real-time ball physics may be visual entertainment, but cannot supply an unverified score for rewards.

- Take a community adventure: vote on a destination, contribute preparation, wait for the return time, and resolve the published outcome.

### Voting and outcomes

Use bounded choices and fixed deadlines. Votes are wallet-authorized and settled by contract rules, including quorum, ties, and no-vote fallback. Core votes select gameplay content; they do not grant arbitrary contract execution. Eligibility can require prior qualifying care days, while acknowledging that this does not eliminate multiple wallets.

Core progress should use deterministic outcomes that require no external oracle. Do not use a timestamp or block hash as supposedly fair randomness for valuable prizes. If a later module needs unpredictable outcomes, its randomness mechanism, manipulation risks, and timeout path must be specified separately before release.

### No attendance bottleneck

Events remain asynchronous and settle through any eligible caller after their deadline. They do not require the creator to return. Timeouts release reserved resources under a fixed rule so an abandoned event cannot lock the pet or its economy.

## Gardens and the expanding world

The full product grows outward from caring for the creature. Each expansion should give people a new way to contribute, personalize their experience, or create shared memories.

### The community garden

Players plant seeds, water crops, help restore neglected plots, and harvest food for the pet. Growth is calculated from recorded planting time and care. No scheduled server job is needed to advance each plant. Harvest is an explicit transaction after the conditions are met.

Distinguish personal plots from shared plots. Personal harvest rights belong to the recorded holder; shared harvest enters the community pantry. A visitor may help water either kind when allowed, but helping does not transfer ownership. Use bounded plot counts and finite planting slots to control storage growth.

### Food and crafting

Recipes turn eligible harvested ingredients into food or decorations. Contracts enforce quantities, consumption, ownership, and output. A shared pantry has capped withdrawal or feeding rules so one wallet cannot empty it. Food rarity may change animation or collection progress, but cannot buy an uncapped Favorite Owner advantage.

### Home and adventures

Players unlock a bed, playground, pond, kitchen, and additional environments through community projects. Cosmetic placements can be personal overlays; shared functional unlocks remain authoritative on-chain. Adventures introduce new materials and content through declared rules and bounded inventories.

### How expansions connect safely

Official modules may maintain their own on-chain state and reference the core pet. The core must not call arbitrary external modules during ordinary care. That would let a broken extension block everyone’s pet.

A module can invoke public care actions only under the same authorization, limits, and benefit rules as other callers. Permissionless developers cannot declare their own unlimited item supply to be valid core food. Cross-module item acceptance requires an explicit, audited recipe or adapter supported by the applicable ruleset.

To preserve an immutable core, the initial interface must include the generic actions and extension boundaries needed by planned expansions. If a future feature genuinely requires new core rules, publish an explicit new version and migration choice; do not conceal it as a cosmetic update.

### Collectibles and trade

Badges representing care and historical relationships are nontransferable. Decorative items or garden goods may be transferable when their module explicitly supports it. A marketplace is optional and does not become necessary to feed the pet. The core launches without a required new fungible token, paid affection, or promised investment return.

## Independent characters and reward systems

### One pet with many appearances

A character pack defines artwork, sounds, animations, dialogue templates, and mappings from standardized pet states and event types. Anyone can publish a cat, robot, dragon, pixel creature, or other original character without approval from the core team. Packs should declare their license and supported protocol versions.

Every compatible client identifies the chain, core contract address, pet ID, and ruleset version. A skin switch preserves all core state. Creating a separate pet or deploying a fork is allowed, but must use its own identity and must not be presented as the original creature.

Rich media can ship inside a downloadable client or be mirrored using content-addressed distribution. Hashes and manifests can be recorded on-chain, but a hash alone does not preserve the artwork bytes. The core must remain usable through text or a minimal generic renderer even if every custom media host disappears.

### Permissionless rewards

Anyone may deploy a separate Koinos reward contract that reads published core records and pays their own tokens, issues collectibles, or grants other benefits. A campaign chooses its sponsor, asset, budget, eligibility, timing, and claim policy. No permission from the pet team is required to read public records or offer independent rewards.

Example: a community funds a campaign that grants a commemorative item to wallets with three qualifying care days that week. The campaign verifies the core’s retained counters and prevents duplicate claims. A different community can run its own campaign simultaneously against the same pet.

### Rewards must have an independent failure boundary

Players explicitly opt into campaigns. A depleted campaign, paused issuer, unavailable reward website, or failed payout must not prevent core care. Claims are separate from care transactions. Core affection remains the same whether the player participates in zero campaigns or many.

On-chain claims should check canonical state or an explicitly designed proof. Contracts must not be assumed able to search old event history arbitrarily. Eligibility that depends on historical facts needs retained summaries, bounded snapshots, or a separately specified proof mechanism. External services such as shop coupons are disclosed as issuer-dependent benefits.

### No implied endorsement

Each campaign identifies its issuer, funding status, expiry, privileges, and whether it uses additional trust or identity checks. Clients can curate listings, but that curation cannot prevent a user from accessing a compatible contract directly. Optional campaign rankings must be clearly distinguished from the core Favorite Owner leaderboard.

## Sharing and community growth

The main growth loop is a personal moment: someone earns affection, the pet reacts, the person shares it, and a friend arrives to meet the same creature. Sharing should follow an enjoyable event rather than interrupt normal play.

### Shareable moments

| Moment                | Example share text                          |
| --------------------- | ------------------------------------------- |
| Becoming the favorite | I am officially his favorite human          |
| A friendly rivalry    | Someone stole my spot while I was asleep    |
| A discovery           | We found out he hates broccoli              |
| A milestone           | I was there when he learned his first trick |
| A shared project      | We finally built his playground             |

Share cards include the chosen character, relevant player alias, event or weekly record, and a route back to the pet. Generate images locally where possible. A standard share payload carries chain, contract, pet ID, and record reference so another frontend can open the same moment if the original link stops working.

### Friendly competition

Let people compare relationships and view the favorite’s public profile. Offer optional alerts for a change in leadership or an upcoming celebration. Avoid hostile messaging, guilt about neglect, and compulsory social posting. Notifications are an optional delivery service and never a protocol dependency.

### Inviting a friend

A visitor should be able to watch before creating or connecting a wallet. An invitation can bring them directly to a shared activity with an explanation of the task. A reward, if offered, should follow qualifying participation rather than merely creating a wallet or clicking a referral link.

Referral accounting belongs in an optional campaign unless it is needed for a specific core feature. It should never grant unrestricted affection. A person inviting their own additional wallets remains a known abuse case; the product must not present wallet counts as verified human counts.

### Community storytelling

Create a weekly recap from settled records: the favorite, new friendships, discoveries, completed projects, and funny reactions. This can be generated by any client or publisher. Optional AI can write flavor copy, but cannot invent authoritative history, determine affection, or become necessary for gameplay.

### Measure what improves the experience

Track returning participating wallets, distinct qualifying care days, action completion rate, concentration of leaderboard scores, shared project participation, and use of independent clients. Referral conversion and notification engagement require optional client analytics; distinguish these from on-chain facts. Collect no unnecessary personal details and do not require email or a social account for core play.

## On chain architecture and persistence

The following is a proposed application architecture, not a claim that these game components already exist in Koinos. Koinos exposes contract storage, calls, and events through system calls; implementation must use the current SDK and network rules. Source: Koinos System calls, listed in the references.

| Component            | Authoritative responsibility                                                   |
| -------------------- | ------------------------------------------------------------------------------ |
| Core pet contract    | Identity, needs, traits, action rules, relationship counters, bounded rankings |
| World modules        | Plots, recipes, possessions, adventures, and project state                     |
| Reward contracts     | Campaign budgets, eligibility, settlements, and claim records                  |
| Optional registry    | Discoverable manifests and contract references without mandatory gatekeeping   |
| Clients and indexers | Rendering, search, full feeds, notifications, and convenient read access       |

### Time and deterministic execution

Store a meter value with its last settled chain time. Reads calculate the current effective value using the published decay or recovery formula. Writes settle elapsed time and then apply the action. Define integer precision, rounding, bounds, and maximum elapsed-time handling identically in all clients.

A frontend clock may animate an estimate, but the contract uses chain context for acceptance. If nobody sends a transaction, no periodic write occurs. A deadline can pass without being settled; the next permissionless settlement transaction records the result. Reads must distinguish a result that is due from one already recorded.

### Current state and durable history

Store all facts required for future gameplay and rewards in contract state, including milestone summaries and claim-relevant period records. Emit a versioned event for each accepted meaningful action with actor, pet ID, action, deltas, and sequence reference. Use transaction and operation references for traceability.

Full narrative history can be reconstructed from chain history where available. Long-term history access requires archival availability; an ordinary RPC endpoint must not be assumed to serve every old event. Publish an open archival and indexing procedure and support multiple operators. Event history alone is insufficient for a future contract claim.

### Published developer interface

Provide versioned schemas and examples for reading a pet, reading a relationship, submitting care, viewing paginated records, settling a period, and claiming module rewards. Return structured errors for cooldowns, changed needs, invalid items, expired events, and authorization failures. Publish bounded query sizes and stable state identifiers.

Document transaction ordering, retries, replay protection, and confirmation handling. Indexers must roll back reorganized history, and clients must distinguish pending data from settled records. No proprietary API key is required to use the protocol through a compatible node.

## Resources security and rule ownership

### Mana and sustainable access

Koinos transactions consume regenerative mana, and a payer can sponsor a user’s resource use. This supports play without each player holding KOIN, but capacity remains finite. Sources: Koinos Mana and Payer semantics, listed in the references.

Support independently operated sponsors and a user-funded fallback. Sponsor policy must be enforced through supported on-chain authorization and budgets, not a mandatory private signing server. Sponsor depletion can prevent sponsored actions; it cannot erase the pet or block a user with another valid payer.

Measure mana for each action, leaderboard update, storage allocation, settlement, and claim on testnet. Size sponsorship from measured sustained activity and bursts. Reject oversized inputs, cap page sizes, avoid full-population scans, and ensure a long idle period cannot create an unbounded settlement task.

### Trust and abuse boundaries

Require the relevant wallet authority for every player action. A caller-provided address is not proof of authorization. Explicitly handle delegated calls and contract callers. Protect inventories, consumption, claims, and arithmetic against duplication, replay, overflow, and malformed inputs.

Clients cannot certify a rewarded game score. Use contract-verifiable actions or a separately disclosed verification mechanism. Monetary campaigns must assess bots, multiple wallets, coordinated manipulation, and any randomness they introduce. Care should remain cooperative even when optional rewards attract competition.

Aliases and character content are public and may be offensive. Client-level filters and blocklists can hide content locally while leaving protocol access open. Do not store email addresses, private messages, or other sensitive personal information in public pet records.

### Stable core and explicit changes

The target is a core ruleset without a retained unilateral upgrade or pause key. Koinos supports contract authorization policies that can prevent re-upload; deployment must verify the actual authority configuration. Source: Koinos Immutable contract guide, listed in the references. This commitment is subject to the underlying chain’s consensus and governance.

Use a revisable testnet deployment for tuning. Audit and freeze the production core only when its extension boundaries are proven. Immutability preserves rules but also preserves bugs. Later changes require a clearly identified version and explicit migration rules, including which history remains authoritative and how rewards distinguish old and new versions.

Core gameplay voting only selects bounded content choices. Modules may have different upgrade or pause policies, but must disclose them. An emergency control in a reward module cannot pause the core pet. An external frontend can disappear without taking possession of the creature or its state.

## Delivery and acceptance criteria

### Delivery sequence

| Stage                | Complete outcome                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| Core launch          | Shared pet, care, relationships, weekly Favorite Owner, history, basic character, share cards             |
| Open ecosystem       | Documented interface, second independent character client, independently funded reward example            |
| Living world         | Garden, pantry, crafting, home projects, adventures, celebrations, evolution                              |
| Production hardening | Resource benchmarks, independent security review, recovery demonstration, published deployment identities |

All stages belong to the final product. They are delivery milestones, not a promise that mainnet contracts can be expanded invisibly. Validate the final architecture before freezing the core. No calendar or cost estimate is committed in this specification.

### Required proof before mainnet launch

- Run two independently configured clients with different characters. Both must show the same pet state, affection, and Favorite Owner after the same confirmed actions.

- Disable every team-operated game service. Complete care, period settlement, and a reward claim using a compatible node and another client or command-line tool.

- Advance through a long idle interval without a scheduler. Needs, growth, and expired activities must resolve correctly with bounded work.

- Test concurrent care, period boundaries, score ties, repeated claims, unauthorized actors, invalid module items, exhausted sponsors, and failed reward transfers.

- Rebuild a new client from published schemas and on-chain state. Rebuild history using the documented archival route, and verify that missing media does not stop care.

- Demonstrate a third-party reward contract that checks canonical eligibility without changing core affection or requiring approval from the original team.

- Verify that deployed authority matches the stated immutability policy and publish source, build instructions, ABI, addresses, licenses, and security findings.

### Values to finalize through implementation

Before deployment, freeze the decay rates, scoring caps, weekly boundary, tie rules, leaderboard size, event defaults, module acceptance rules, storage retention, and sponsorship limits. These are balance and engineering settings within this product definition. The pet name and initial artwork also remain open.

### Definition of success

People return because the creature recognizes their contribution. Communities can extend its world and offer their own rewards. Independent developers can replace the interface, character, and optional services while preserving the same shared pet and its on-chain relationships.

## Technical references

Official Koinos documentation consulted on 12 September 2026. These sources support platform capabilities and constraints. Game mechanics, schemas, scoring, and extension policies in this document are proposed product requirements.

### Mana

Regenerative resource use and sponsorship context.

https://docs.koinos.io/overview/mana/

### System calls

Contract interaction with blockchain functionality, including storage and events.

https://docs.koinos.io/architecture/system-calls/

### Immutable contract guide

Authorization-based protection against contract re-upload.

https://docs.koinos.io/developers/guides/immutable/

### Payer semantics

Implementation reference for transaction payer and authorization behavior.

https://docs.koinos.io/developers/payer-payee/

### Terminology

Core means the authoritative shared pet rules and state. A client is any interface that reads and submits actions. A character pack changes presentation. A module is an additional contract with its own state and responsibilities. A campaign is an optional reward program. An indexer reconstructs convenient views from public chain data.

On-chain means authoritative data or execution recorded within Koinos. A content hash recorded on-chain is a reference to bytes, not proof that those bytes remain available. Independent operation means the game has no required team-operated backend; it still relies on the blockchain network and access to it.
