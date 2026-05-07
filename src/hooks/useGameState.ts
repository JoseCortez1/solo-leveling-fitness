import { useState, useEffect, useCallback } from 'react';
import { Hunter, DailyState, getRankFromLevel, DEFAULT_QUESTS } from '../types';
import { saveHunter, loadHunter, saveDailyState, loadDailyState, getTodayDateString, isNewDay } from '../utils/storage';

export function useGameState() {
  const [hunter, setHunter] = useState<Hunter | null>(null);
  const [dailyState, setDailyState] = useState<DailyState | null>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  // Initialize state from localStorage
  useEffect(() => {
    const savedHunter = loadHunter();
    const savedDaily = loadDailyState();

    if (savedHunter) {
      setHunter(savedHunter);
      setIsActivated(true);

      if (savedDaily && !isNewDay(savedDaily.date)) {
        setDailyState(savedDaily);
      } else {
        // New day - reset quests
        const newDaily: DailyState = {
          date: getTodayDateString(),
          quests: DEFAULT_QUESTS(),
          questsCompleted: 0,
        };
        setDailyState(newDaily);
        saveDailyState(newDaily);
      }
    }

    setIsLoading(false);
  }, []);

  // Save hunter whenever it changes
  useEffect(() => {
    if (hunter) {
      saveHunter(hunter);
    }
  }, [hunter]);

  // Save daily state whenever it changes
  useEffect(() => {
    if (dailyState) {
      saveDailyState(dailyState);
    }
  }, [dailyState]);

  const activateSystem = useCallback((name: string, bonusStats: { str: number; sta: number; agi: number; vit: number }) => {
    const newHunter: Hunter = {
      id: crypto.randomUUID(),
      name,
      level: 1,
      xp: 0,
      rank: 'E',
      stats: {
        str: 5 + bonusStats.str,
        sta: 5 + bonusStats.sta,
        agi: 5 + bonusStats.agi,
        vit: 5 + bonusStats.vit,
      },
      createdAt: new Date().toISOString(),
      streak: 0,
    };

    const today = getTodayDateString();
    const initialDaily: DailyState = {
      date: today,
      quests: DEFAULT_QUESTS(),
      questsCompleted: 0,
    };

    setHunter(newHunter);
    setDailyState(initialDaily);
    setIsActivated(true);
  }, []);

  const addXP = useCallback((amount: number) => {
    if (!hunter) return;

    let newXP = hunter.xp + amount;
    let newLevel = hunter.level;
    let newRank = hunter.rank;
    let levelUpOccurred = false;

    while (newXP >= newLevel * 100) {
      newXP -= newLevel * 100;
      newLevel++;
      newRank = getRankFromLevel(newLevel);
      levelUpOccurred = true;
    }

    if (levelUpOccurred) {
      setLevelUpLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }

    setHunter(prev => prev ? {
      ...prev,
      xp: newXP,
      level: newLevel,
      rank: newRank,
    } : null);
  }, [hunter]);

  const updateQuestProgress = useCallback((questId: string, reps: number) => {
    if (!dailyState) return;

    const updatedQuests = dailyState.quests.map(q => {
      if (q.id === questId) {
        const newReps = Math.min(reps, q.targetReps);
        return { ...q, currentReps: newReps };
      }
      return q;
    });

    const completedCount = updatedQuests.filter(q => q.completed).length;

    setDailyState({
      ...dailyState,
      quests: updatedQuests,
      questsCompleted: completedCount,
    });
  }, [dailyState]);

  const completeQuest = useCallback((questId: string) => {
    if (!dailyState || !hunter) return;

    const quest = dailyState.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // Mark quest as completed
    const updatedQuests = dailyState.quests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    );

    const newCompletedCount = updatedQuests.filter(q => q.completed).length;

    setDailyState({
      ...dailyState,
      quests: updatedQuests,
      questsCompleted: newCompletedCount,
    });

    // Add XP
    addXP(quest.xpReward);

    // Check for bonus XP if all quests completed
    if (newCompletedCount === dailyState.quests.length) {
      setTimeout(() => addXP(50), 500); // Bonus 50 XP for clearing all
    }
  }, [dailyState, hunter, addXP]);

  return {
    hunter,
    dailyState,
    isActivated,
    isLoading,
    showLevelUp,
    levelUpLevel,
    activateSystem,
    updateQuestProgress,
    completeQuest,
    addXP,
  };
}