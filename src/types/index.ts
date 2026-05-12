export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type Difficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Stats {
  str: number;
  sta: number;
  agi: number;
  vit: number;
}

export interface Hunter {
  id: string;
  name: string;
  level: number;
  xp: number;
  rank: Rank;
  stats: Stats;
  createdAt: string;
  streak: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  exercise: string;
  targetReps: number;
  xpReward: number;
  completed: boolean;
  currentReps: number;
}

export interface DailyState {
  date: string;
  quests: Quest[];
  questsCompleted: number;
}

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export const RANK_THRESHOLDS: Record<Rank, number> = {
  'E': 1,
  'D': 10,
  'C': 25,
  'B': 40,
  'A': 60,
  'S': 80,
};

export const RANK_COLORS: Record<Rank, string> = {
  'E': '#9E9E9E',
  'D': '#4FC3F7',
  'C': '#2ED573',
  'B': '#FFD60A',
  'A': '#FF4757',
  'S': '#9C27B0',
};

export function calculateXPForLevel(level: number): number {
  return level * 100;
}

export function getRankFromLevel(level: number): Rank {
  let rank: Rank = 'E';
  for (const [r, threshold] of Object.entries(RANK_THRESHOLDS)) {
    if (level >= threshold) {
      rank = r as Rank;
    }
  }
  return rank;
}

export function getNextRank(level: number): Rank | null {
  const currentRank = getRankFromLevel(level);
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  if (currentIndex < RANK_ORDER.length - 1) {
    return RANK_ORDER[currentIndex + 1];
  }
  return null;
}

export const DEFAULT_QUESTS: () => Quest[] = () => [
  {
    id: 'q1',
    name: 'Hunt 10 Low-Level Monsters',
    description: 'The goblins are weak. Show them your strength.',
    exercise: 'pushups',
    targetReps: 10,
    xpReward: 50,
    completed: false,
    currentReps: 0,
  },
  {
    id: 'q2',
    name: 'Clear a Dungeon Floor',
    description: 'Squat down and obliterate the dungeon entrance.',
    exercise: 'squats',
    targetReps: 20,
    xpReward: 75,
    completed: false,
    currentReps: 0,
  },
  {
    id: 'q3',
    name: 'Train Your Stamina',
    description: 'Hold your ground like a statue. No flinching.',
    exercise: 'plank',
    targetReps: 30,
    xpReward: 60,
    completed: false,
    currentReps: 0,
  },
  {
    id: 'q4',
    name: 'Hunt a Boss Monster',
    description: 'This will test everything. Burpees for power.',
    exercise: 'burpees',
    targetReps: 15,
    xpReward: 100,
    completed: false,
    currentReps: 0,
  },
  {
    id: 'q5',
    name: 'Meditate in the Shadow',
    description: 'Sit against the wall. Focus. Breathe. Become one with the void.',
    exercise: 'wallsit',
    targetReps: 45,
    xpReward: 40,
    completed: false,
    currentReps: 0,
  },
];