export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type Difficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Hunter {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  rank: Rank;
  str: number;
  sta: number;
  agi: number;
  vit: number;
  difficulty: Difficulty;
  streak: number;
  last_active_date: string | null;
  created_at: string;
}

export interface DailyQuest {
  id: string;
  hunter_id: string;
  date: string;
  quest_index: number;
  name: string;
  exercise: string;
  target_reps: number;
  current_reps: number;
  xp_reward: number;
  completed: number;
}

export const DIFFICULTY_CONFIG = {
  'E': { label: 'Casual', repMultiplier: 0.5, xpMultiplier: 0.75, restSeconds: 90 },
  'D': { label: 'Normal', repMultiplier: 1.0, xpMultiplier: 1.0, restSeconds: 60 },
  'C': { label: 'Hard', repMultiplier: 1.5, xpMultiplier: 1.25, restSeconds: 45 },
  'B': { label: 'Veteran', repMultiplier: 2.0, xpMultiplier: 1.5, restSeconds: 30 },
  'A': { label: 'Expert', repMultiplier: 2.5, xpMultiplier: 1.75, restSeconds: 20 },
  'S': { label: 'Insane', repMultiplier: 3.0, xpMultiplier: 2.0, restSeconds: 10 },
} as const;

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
export const RANK_THRESHOLDS: Record<Rank, number> = { 'E': 1, 'D': 10, 'C': 25, 'B': 40, 'A': 60, 'S': 80 };
export const RANK_COLORS: Record<Rank, string> = { 'E': '#9E9E9E', 'D': '#4FC3F7', 'C': '#2ED573', 'B': '#FFD60A', 'A': '#FF4757', 'S': '#9C27B0' };

export function getRankFromLevel(level: number): Rank {
  let rank: Rank = 'E';
  for (const [r, threshold] of Object.entries(RANK_THRESHOLDS)) {
    if (level >= threshold) rank = r as Rank;
  }
  return rank;
}

export function getNextRank(level: number): Rank | null {
  const currentRank = getRankFromLevel(level);
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  if (currentIndex < RANK_ORDER.length - 1) return RANK_ORDER[currentIndex + 1];
  return null;
}
