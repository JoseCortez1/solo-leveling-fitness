import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, queryAll, execute } from '../db.js';
import { AuthRequest } from '../auth.js';
import { getRankFromLevel, DIFFICULTY_CONFIG, Difficulty } from '../types.js';

const router = Router();

// GET /api/quests
router.get('/', (req: AuthRequest, res: Response) => {
  const hunter = queryOne('SELECT * FROM hunters WHERE user_id = ?', [req.userId]);
  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found' });
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  if (hunter.last_active_date !== today) {
    const newStreak = hunter.last_active_date
      ? (isYesterday(hunter.last_active_date) ? (hunter.streak || 0) + 1 : 0)
      : 0;

    execute('UPDATE hunters SET last_active_date = ?, streak = ? WHERE id = ?', [today, newStreak, hunter.id]);
    execute('DELETE FROM daily_quests WHERE hunter_id = ? AND date = ?', [hunter.id, today]);
    createDailyQuests(hunter.id, today, hunter.difficulty as Difficulty);
  }

  const quests = queryAll(
    'SELECT * FROM daily_quests WHERE hunter_id = ? AND date = ? ORDER BY quest_index',
    [hunter.id, today]
  );

  const completedCount = quests.filter((q: any) => q.completed === 1).length;

  res.json({ date: today, quests, questsCompleted: completedCount });
});

// PUT /api/quests/:id/progress
router.put('/:id/progress', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { currentReps } = req.body;

  const quest = queryOne(
    'SELECT q.*, h.user_id FROM daily_quests q JOIN hunters h ON q.hunter_id = h.id WHERE q.id = ?',
    [id]
  );

  if (!quest || quest.user_id !== req.userId) {
    res.status(404).json({ error: '[SYSTEM] Quest not found' });
    return;
  }

  const clampedReps = Math.min(Math.max(0, currentReps), quest.target_reps);
  execute('UPDATE daily_quests SET current_reps = ? WHERE id = ?', [clampedReps, id]);

  res.json({ id, currentReps: clampedReps, targetReps: quest.target_reps });
});

// POST /api/quests/:id/complete
router.post('/:id/complete', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const quest = queryOne(
    'SELECT q.*, h.xp as hunter_xp, h.level, h.rank, h.id as hunter_id, h.difficulty FROM daily_quests q JOIN hunters h ON q.hunter_id = h.id WHERE q.id = ?',
    [id]
  );

  if (!quest || quest.user_id !== req.userId) {
    res.status(404).json({ error: '[SYSTEM] Quest not found' });
    return;
  }

  if (quest.completed === 1) {
    res.status(400).json({ error: '[SYSTEM] Quest already completed' });
    return;
  }

  if (quest.current_reps < quest.target_reps) {
    res.status(400).json({ error: '[SYSTEM] Not enough reps. Complete the target first.' });
    return;
  }

  // Mark quest as completed
  execute('UPDATE daily_quests SET completed = 1 WHERE id = ?', [id]);

  // Add XP
  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.D;
  const xpGained = Math.round(quest.xp_reward * diffConfig.xpMultiplier);
  let newXP = (quest.hunter_xp || 0) + xpGained;
  let newLevel = quest.level;
  let levelUp = false;

  while (newXP >= newLevel * 100) {
    newXP -= newLevel * 100;
    newLevel++;
    levelUp = true;
  }

  const newRank = getRankFromLevel(newLevel);
  execute('UPDATE hunters SET xp = ?, level = ?, rank = ? WHERE id = ?', [newXP, newLevel, newRank, quest.hunter_id]);

  // Check all quests completed (bonus XP)
  const today = new Date().toISOString().split('T')[0];
  const remaining = queryAll(
    'SELECT id FROM daily_quests WHERE hunter_id = ? AND date = ? AND completed = 0 AND id != ?',
    [quest.hunter_id, today, id]
  );

  let allCleared = false;
  if (remaining.length === 0) {
    allCleared = true;
    const bonusXP = 50;
    newXP += bonusXP;

    while (newXP >= newLevel * 100) {
      newXP -= newLevel * 100;
      newLevel++;
      levelUp = true;
    }
    const finalRank = getRankFromLevel(newLevel);
    execute('UPDATE hunters SET xp = ?, level = ?, rank = ? WHERE id = ?', [newXP, newLevel, finalRank, quest.hunter_id]);
  }

  res.json({
    xpGained,
    xp: newXP,
    level: newLevel,
    rank: newRank,
    levelUp,
    allCleared,
    allClearedBonus: allCleared ? 50 : 0,
  });
});

function createDailyQuests(hunterId: string, date: string, difficulty: Difficulty): void {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.D;
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

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export default router;
