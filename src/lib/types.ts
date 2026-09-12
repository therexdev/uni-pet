export type Skin = 'sprout' | 'cloud' | 'ember';
export type ActionKind =
  | 'feed'
  | 'play'
  | 'clean'
  | 'comfort'
  | 'plant'
  | 'water'
  | 'harvest'
  | 'craft'
  | 'contribute'
  | 'vote'
  | 'adventure'
  | 'return';
export interface Pet {
  name: string;
  born: string;
  updated: string;
  nourishment: number;
  happiness: number;
  cleanliness: number;
  energy: number;
  affection: number;
  curiosity: number;
  playfulness: number;
  mischief: number;
  actions: number;
  project: number;
  level: number;
  votes: number[];
}
export interface Plot {
  planted: string;
  watered: boolean;
  crop: number;
}
export interface Owner {
  address: string;
  week: number;
  score: number;
  day: number;
  daily_points: number;
  daily_actions: number;
  last_action: string;
  care_days: number;
  lifetime_days: number;
  berries: number;
  treats: number;
  plots: Plot[];
  adventure_end: string;
  voted: boolean;
  contributions: number;
  play_points: number;
  comfort_points: number;
  feed_points: number;
}
export interface Entry {
  address: string;
  score: number;
  sequence: number;
}
export interface Board {
  week: number;
  entries: Entry[];
  settled: boolean;
}
export interface PetEvent {
  sequence: number;
  actor: string;
  kind: string;
  points: number;
  time: string;
}
export interface View {
  pet: Pet;
  board: Board;
  events: PetEvent[];
  time: string;
}
export interface Config {
  mode: 'playground' | 'chain';
  network: 'harbinger' | 'mainnet';
  rpcUrls: string[];
  chainId: string;
  contractId: string;
  rewardContractId: string;
  sponsorAddress: string;
  coreFrozen?: boolean;
  rewardFrozen?: boolean;
}
export interface Action {
  kind: ActionKind;
  slot?: number;
  choice?: number;
  min_points?: number;
}
export interface Gateway {
  read(address?: string): Promise<{ view: View; owner: Owner | null }>;
  connect(): Promise<string>;
  act(address: string, action: Action): Promise<string>;
  settle(week: number): Promise<string>;
  claim(address: string, week: number): Promise<string>;
  rewardStatus(address: string, week: number): Promise<{ claimed: boolean; eligible: boolean }>;
}
export const DAY = 86400000,
  WEEK = 7 * DAY;
export const ACTIONS: ActionKind[] = [
  'feed',
  'play',
  'clean',
  'comfort',
  'plant',
  'water',
  'harvest',
  'craft',
  'contribute',
  'vote',
  'adventure',
  'return',
];
export const emptyOwner = (address: string, now: number): Owner => ({
  address,
  week: Math.floor(now / WEEK),
  score: 0,
  day: Math.floor(now / DAY),
  daily_points: 0,
  daily_actions: 0,
  last_action: '0',
  care_days: 0,
  lifetime_days: 0,
  berries: 3,
  treats: 0,
  plots: Array.from({ length: 3 }, () => ({ planted: '0', watered: false, crop: 0 })),
  adventure_end: '0',
  voted: false,
  contributions: 0,
  play_points: 0,
  comfort_points: 0,
  feed_points: 0,
});
