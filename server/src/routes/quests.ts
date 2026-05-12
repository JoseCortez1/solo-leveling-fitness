import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import { AuthRequest } from '../auth.js';
import { getRankFromLevel, DIFFICULTY_CONFIG } from '../types.js';

const router = Router();

// GET /api/quests — Get daily quests, regenerate if new day
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const hunter = db.prepare('SELECT * FROM hunters WHERE user_id = ?').get(req.userId!) as any;

  if (!hunter) {
    res.status(404).json({ error: '[SYSTEM] No hunter found' });
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if it's a new day
  if (hunter.last_active_date !== today) {
    // Update last active and reset streak
    const newStreak = hunter.last_active_date
      ? (isYesterday(hunter.last_active_date) ? hunter.streak + 1 : 0)
      : 0;

    db.prepare('UPDATE hunters SET last_active_date = ?, streak = ? WHERE id = ?')
      .run(today, newStreak, hunter.id);

    // Delete old quests, create new ones
    db.prepare('DELETE FROM daily_quests WHERE hunter_id = ? AND date = ?')
      .run(hunter.id, today);

    createDailyQuests(db, hunter.id, today, hunter.difficulty);
  }

  const quests = db.prepare('SELECT * FROM daily_quests WHERE hunter_id = ? AND date = ? ORDER BY quest_index')
    .all(hunter.id, today) as any[];

  const completedCount = quests.filter((q: any) => q.completed === 1).length;

  res.json({ date: today, quests, questsCompleted: completedCount });
});

// PUT /api/quests/:id/progress — Update reps for a quest
router.put('/:id/progress', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { currentReps } = req.body;

  const db = getDb();
  const quest = db.prepare(
    'SELECT q.* FROM daily_quests q JOIN hunters h ON q.hunter_id = h.id WHERE q.id = ? AND h.user_id = ?'
  ).get(id, req.userId!) as any;

  if (!quest) {
    res.status(404).json({ error: '[SYSTEM] Quest not found' });
    return;
  }

  const clampedReps = Math.min(Math.max(0, currentReps), quest.target_reps);
  db.prepare('UPDATE daily_quests SET current_reps = ? WHERE id = ?').run(clampedReps, id);

  res.json({ id, currentReps: clampedReps, targetReps: quest.target_reps });
});

// POST /api/quests/:id/complete — Complete a quest, gain XP, check level up
router.post('/:id/complete', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const db = getDb();
  const quest = db.prepare(
    'SELECT q.*, h.xp as hunter_xp, h.level, h.rank, h.id as hunter_id FROM daily_quests q JOIN hunters h ON q.hunter_id = h.id WHERE q.id = ? AND h.user_id = ?'
  ).get(id, req.userId!) as any;

  if (!quest) {
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
  db.prepare('UPDATE daily_quests SET completed = 1 WHERE id = ?').run(id);

  // Add XP
  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.D;
  const xpGained = Math.round(quest.xp_reward * diffConfig.xpMultiplier);
  let newXP = quest.hunter_xp + xpGained;
  let newLevel = quest.level;
  let levelUp = false;

  while (newXP >= newLevel * 100) {
    newXP -= newLevel * 100;
    newLevel++;
    levelUp = true;
  }

  const newRank = getRankFromLevel(newLevel);

  db.prepare('UPDATE hunters SET xp = ?, level = ?, rank = ? WHERE id = ?')
    .run(newXP, newLevel, newRank, quest.hunter_id);

  // Check if all quests are done (bonus XP)
  const today = new Date().toISOString().split('T')[0];
  const remainingUncompleted = db.prepare(
    'SELECT COUNT(*) as count FROM daily_quests WHERE hunter_id = ? AND date = ? AND completed = 0 AND id != ?'
  ).get(quest.hunter_id, today, id) as any;

  let allCleared = false;
  if (remainingUncompleted.count === 0) {
    allCleared = true;
    // Bonus XP for clearing all
    const bonusXP = 50;
    newXP += bonusXP;

    // Level up check after bonus
    while (newXP >= newLevel * 100) {
      newXP -= newLevel * 100;
      newLevel++;
      levelUp = true;
    }
    const finalRank = getRankFromLevel(newLevel);
    db.prepare('UPDATE hunters SET xp = ?, level = ?, rank = ? WHERE id = ?')
      .run(newXP, newLevel, finalRank, quest.hunter_id);
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

function createDailyQuests(db: any, hunterId: string, date: string, difficulty: string): void {
  const config = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.D;
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
    insert.run(uuidv4(), hunterId, date, i, q.name, q.exercise, Math.max(1, targetReps), Math.max(1, xpReward));
  }
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export default router;
