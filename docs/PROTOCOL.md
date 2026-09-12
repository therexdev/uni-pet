# Uni Pet protocol version 1

## Identity and execution

The canonical identity is `(chain ID, core contract address)`. Version 1 has one pet per core contract. Character packs have no authority over identity or state. A new contract creates another pet, not another skin for the existing one.

All accepted actions run through `act`. The contract validates the actor's Koinos authority, parameters, cooldown, inventory, and limits before recording results. There is no privileged method to add affection or edit the pet. A deployment can still be replaceable until its upload authority is frozen; inspect deployment metadata.

The rule clock is the block header timestamp in milliseconds. Whole-hour meter changes retain fractional elapsed time. No scheduler updates meters every minute. `get_view` derives the effective state without a transaction. `act` settles elapsed time and applies the action. A long idle period takes bounded work.

## Rules implemented

| Rule                            | Value                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Nourishment decay               | 2 per elapsed hour                                                             |
| Happiness and cleanliness decay | 1 per elapsed hour                                                             |
| Energy recovery                 | 3 per elapsed hour                                                             |
| Meter range                     | 0 to 100                                                                       |
| Feed                            | +18 nourishment; rejected at 95 or above                                       |
| Play                            | +15 happiness, -10 energy; needs 10 energy                                     |
| Clean                           | +20 cleanliness; rejected at 95 or above                                       |
| Comfort                         | +8 happiness                                                                   |
| Care affection                  | 10 if relevant pre-action meter is under 70; otherwise 4                       |
| Daily affection cap             | 40 per wallet                                                                  |
| Activity cap                    | 24 accepted actions per wallet per UTC day                                     |
| Cooldown                        | 10 seconds between all accepted actions per wallet                             |
| Competition                     | Fixed 7-day Unix epochs; Thursday 00:00 UTC boundaries                         |
| Leaderboard                     | Best 20 for each week                                                          |
| Garden                          | 3 plots per wallet; free seeds                                                 |
| Crop time                       | 8 hours, or 4 hours when watered once                                          |
| Harvest                         | 3 berries per plot                                                             |
| Initial inventory               | 3 berries, 0 treats                                                            |
| Recipe                          | 3 berries become 1 treat                                                       |
| Picnic                          | 1 treat = 1 contribution and up to 8 affection                                 |
| Picnic cap                      | 2 contributions per wallet per UTC day                                         |
| Evolution                       | One level for every 100 lifetime picnic contributions                          |
| Adventure                       | One hour; return explicitly to receive 2 berries                               |
| Inventory bounds                | At most 10,000 berries and 1,000 treats                                        |
| Destination preferences         | One vote per wallet per week, after at least one care day; totals are lifetime |

A qualifying care day is a UTC day with positive affection. Continued actions after the daily affection cap do not add care days. Lifetime days survive weekly resets. Care Club badges require three qualifying days in the requested week.

Favorite Owner is an affectionate title, not custody or control. A higher weekly score wins. Equal scores use the earlier sequence at which the score was reached. Weekly scores never decrease, so a bounded top list can be updated without rescanning all owners. `settle` closes a completed nonempty week's board permissionlessly. It cannot settle the current week.

The `min_points` argument rejects an action if another transaction or the daily cap leaves fewer points than the caller expects. Failed transactions do not mutate game state, but can still consume network resources. The reference UI permits actions for enjoyment after the points cap and requests zero minimum points.

## Interface

The generated ABI is the exact source for entry points and serialization. Use `public/contracts/core-abi.json` with Koilib. Never invent entry points.

| Method       | Arguments                                                  | Result                                                    |
| ------------ | ---------------------------------------------------------- | --------------------------------------------------------- |
| `initialize` | Empty; deployment authority required                       | Creates Uni once                                          |
| `get_view`   | Empty                                                      | Effective pet, current top 20, last 20 events, chain time |
| `get_owner`  | `address`                                                  | Effective weekly counters and permanent inventory         |
| `get_period` | `address`, `week`                                          | Retained care-day and score summary for rewards           |
| `get_board`  | `week`                                                     | Bounded weekly leaderboard                                |
| `act`        | `address`, `kind`, optional `slot`, `choice`, `min_points` | Awarded points and event sequence                         |
| `settle`     | Completed `week`                                           | Settled weekly board                                      |

Action kinds are `feed`, `play`, `clean`, `comfort`, `plant`, `water`, `harvest`, `craft`, `contribute`, `vote`, `adventure`, and `return`.

## Storage and history

| Space | Contents                                          |
| ----- | ------------------------------------------------- |
| 0     | Pet singleton                                     |
| 1     | Owner state keyed by address                      |
| 2     | Weekly top-20 board keyed by decimal week         |
| 3     | Most recent 20 actions                            |
| 4     | Retained weekly summaries keyed by `week:address` |

Every accepted action emits `unipet.action.v1` with sequence, actor, kind, awarded points, and time. Full history needs access to archived blockchain events; a frontend cache is not authoritative. The latest 20 and all reward-relevant summaries are readable from contract state. A chain node or third-party indexer can support full-history views without becoming necessary for care.

Owner records and retained weekly summaries grow with participation. Per-call work is bounded; total state is not constant. Measure this growth and its mana cost before increasing scale. There is no claim of verified 1,000-user capacity yet.

## Deliberate limits

One wallet is not one human. No algorithm here provides Sybil resistance. Monetary campaigns must set their own eligibility rules. No stake, item purchase, sponsor contribution, character choice, or external reward directly multiplies core affection.

Preference votes do not yet select an implemented branching adventure. The current trail has a deterministic reward. There is no random prize generator, off-chain score oracle, or trusted game operator.
