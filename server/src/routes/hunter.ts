import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, queryAll, execute } from '../db.js';
import { AuthRequest } from '../auth.js';
import {
  DIFFICULTY_CONFIG,
  Difficulty,
  getRankFromLevel,
} from '../types.js';

const router = Router();

// POST /api/hunter/activate
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

  const existing = queryOne('SELECT id FROM hunters WHERE user_id = ?', [userId]);
  if (existing) {
    res.status(409).json({ error: '[SYSTEM] Hunter already activated' });
    return;
  }

  const id = uuidv4();
  const baseStats = {
    str: 5 + Math.min(str, 10),
    sta: 5 + Math.min(sta, 10),
    agi: 5 + Math.min(agi, 10),
    vit: 5 + Math.min(vit, 10),
  };
  const today = new Date().toISOString().split('T')[0];

  execute(
    'INSERT INTO hunters (id, user_id, level, xp, rank, str, sta, agi, vit, difficulty, streak, last_active_date, created_at) VALUES (?, ?, 1, 0, \'E\', ?, ?, ?, ?, ?, 0, ?, datetime(\'now\'))',
    [id, userId, baseStats.str, baseStats.sta, baseStats.agi, baseStats.vit, difficulty, today]
  );

  createDailyQuests(id, today, difficulty as Difficulty);

  const hunter = queryOne('SELECT * FROM hunters WHERE id = ?', [id]);
  res.status(201).json(hunter);
});

// GET /api/hunter
router.get('/', (req: AuthRequest, res: Response) => {
  const hunter = queryOne('SELECT * FROM hunters WHERE user_id = ?', [req.userId]);

  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found. Activate the System first.' });
    return;
  }

  res.json(hunter);
});

// PUT /api/hunter/difficulty
router.put('/difficulty', (req: AuthRequest, res: Response) => {
  const { difficulty } = req.body;
  const validDifficulties = ['E', 'D', 'C', 'B', 'A', 'S'];

  if (!validDifficulties.includes(difficulty)) {
    res.status(400).json({ error: '[SYSTEM] Invalid difficulty. Choose E, D, C, B, A, or S' });
    return;
  }

  const hunter = queryOne('SELECT * FROM hunters WHERE user_id = ?', [req.userId]);
  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found' });
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  if (hunter.last_active_date === today) {
    res.status(429).json({ error: '[SYSTEM] Can only change difficulty once per day. Wait for daily reset.' });
    return;
  }

  execute('UPDATE hunters SET difficulty = ?, last_active_date = ? WHERE id = ?', [difficulty, today, hunter.id]);

  // Regenerate quests
  execute('DELETE FROM daily_quests WHERE hunter_id = ? AND date = ?', [hunter.id, today]);
  createDailyQuests(hunter.id, today, difficulty as Difficulty);

  const updated = queryOne('SELECT * FROM hunters WHERE id = ?', [hunter.id]);
  res.json(updated);
});

function createDailyQuests(hunterId: string, date: string, difficulty: Difficulty): void {
  const config = DIFFICULTY_CONFIG[difficulty];
  const baseQuests = [
    { name: 'Hunt 10 Low-Level Monsters', exercise: 'pushups', baseReps: 10, xp: 50 },
    { name: 'Clear a Dungeon Floor', exercise: 'squats', baseReps: 20, xp: 75 },
    { name: 'Train Your Stamina', exercise: 'plank', baseReps: 30, xp: 60 },
    { name: 'Hunt a Boss Monster', exercise: 'burpees', baseReps: 15, xp: 100 },
    { name: 'Meditate in the Shadow', exercise: 'wallsit', baseReps: 45, xp: 40 },
  ];

  for (let i = 0; i < baseQuests.length; i++) {
    const q = baseQuests[i];
    const targetReps = Math.max(1, Math.round(q.baseReps * config.repMultiplier));
    const xpReward = Math.max(1, Math.round(q.xp * config.xpMultiplier));
    execute(
      'INSERT INTO daily_quests (id, hunter_id, date, quest_index, name, exercise, target_reps, current_reps, xp_reward, completed) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0)',
      [uuidv4(), hunterId, date, i, q.name, q.exercise, targetReps, xpReward]
    );
  }
}

export default router;
