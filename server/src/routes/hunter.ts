import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { AuthRequest } from '../auth.js';
import {
  DIFFICULTY_CONFIG,
  Difficulty,
  getRankFromLevel,
  RANK_THRESHOLDS,
  Hunter,
} from '../types.js';

const router = Router();

// POST /api/hunter/activate — Create hunter after registration
router.post('/activate', (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name, str = 0, sta = 0, agi = 0, vit = 0, difficulty = 'D' } = req.body;

  if (!name) {
    res.status(400).json({ error: '[SYSTEM] Hunter name is required' });
    return;
  }

  if (!['E', 'D', 'C', 'B', 'A', 'S'].includes(difficulty)) {
    res.status(400).json({ error: '[SYSTEM] Invalid difficulty. Choose E, D, C, B, A, or S' });
    return;
  }

  const db = getDb();

  // Check if hunter already exists
  const existing = db.prepare('SELECT id FROM hunters WHERE user_id = ?').get(userId) as any;
  if (existing) {
    res.status(409).json({ error: '[SYSTEM] Hunter already activated' });
    return;
  }

  const id = uuidv4();
  const baseStats = { str: 5 + Math.min(str, 10), sta: 5 + Math.min(sta, 10), agi: 5 + Math.min(agi, 10), vit: 5 + Math.min(vit, 10) };
  const today = new Date().toISOString().split('T')[0];

  db.prepare(
    'INSERT INTO hunters (id, user_id, level, xp, rank, str, sta, agi, vit, difficulty, streak, last_active_date, created_at) VALUES (?, ?, 1, 0, ?, ?, ?, ?, ?, ?, 0, ?, datetime(\'now\'))'
  ).run(id, userId, 'E', baseStats.str, baseStats.sta, baseStats.agi, baseStats.vit, difficulty, today);

  // Generate daily quests
  createDailyQuests(db, id, today, difficulty);

  const hunter = db.prepare('SELECT * FROM hunters WHERE id = ?').get(id) as any;
  res.status(201).json(hunter);
});

// GET /api/hunter — Get hunter profile
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const hunter = db.prepare('SELECT * FROM hunters WHERE user_id = ?').get(req.userId!) as any;

  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found. Activate the System first.' });
    return;
  }

  res.json(hunter);
});

// PUT /api/hunter/difficulty — Change difficulty (once per day)
router.put('/difficulty', (req: AuthRequest, res: Response) => {
  const { difficulty } = req.body;
  const validDifficulties = ['E', 'D', 'C', 'B', 'A', 'S'];

  if (!validDifficulties.includes(difficulty)) {
    res.status(400).json({ error: '[SYSTEM] Invalid difficulty. Choose E, D, C, B, A, or S' });
    return;
  }

  const db = getDb();
  const hunter = db.prepare('SELECT * FROM hunters WHERE user_id = ?').get(req.userId!) as any;

  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found' });
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  // Can change once per day
  if (hunter.last_active_date === today) {
    res.status(429).json({ error: '[SYSTEM] Can only change difficulty once per day. Wait for daily reset.' });
    return;
  }

  db.prepare('UPDATE hunters SET difficulty = ?, last_active_date = ? WHERE id = ?').run(difficulty, today, hunter.id);

  // Regenerate quests with new difficulty
  db.prepare('DELETE FROM daily_quests WHERE hunter_id = ? AND date = ?').run(hunter.id, today);
  createDailyQuests(db, hunter.id, today, difficulty);

  const updated = db.prepare('SELECT * FROM hunters WHERE id = ?').get(hunter.id) as any;
  res.json(updated);
});

function createDailyQuests(db: any, hunterId: string, date: string, difficulty: Difficulty): void {
  const config = DIFFICULTY_CONFIG[difficulty];
  const baseQuests = [
    { name: 'Hunt 10 Low-Level Monsters', exercise: 'pushups', baseReps: 10, xp: 50 },
    { name: 'Clear a Dungeon Floor', exercise: 'squats', baseReps: 20, xp: 75 },
    { name: 'Train Your Stamina', exercise: 'plank', baseReps: 30, xp: 60 },
    { name: 'Hunt a Boss Monster', exercise: 'burpees', baseReps: 15, xp: 100 },
    { name: 'Meditate in the Shadow', exercise: 'wallsit', baseReps: 45, xp: 40 },
  ];

  const insert = db.prepare(
    'INSERT INTO daily_quests (id, hunter_id, date, quest_index, name, exercise, target_reps, current_reps, xp_reward, completed) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0)'
  );

  for (let i = 0; i < baseQuests.length; i++) {
    const q = baseQuests[i];
    const targetReps = Math.round(q.baseReps * config.repMultiplier);
    const xpReward = Math.round(q.xp * config.xpMultiplier);
    insert.run(uuidv4(), hunterId, date, i, q.name, q.exercise, targetReps, xpReward);
  }
}

export default router;
