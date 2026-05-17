import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest } from '../types';

interface QuestModalProps {
  quest: Quest;
  onClose: () => void;
  onUpdateReps: (questId: string, reps: number) => void;
  onComplete: (questId: string) => void;
}

const exerciseEmojis: Record<string, string> = {
  pushups: '💪',
  squats: '🦵',
  plank: '🧘',
  burpees: '🔥',
  wallsit: '🧱',
};

export function QuestModal({ quest, onClose, onUpdateReps, onComplete }: QuestModalProps) {
  const targetReps = quest.targetReps ?? 1;
  const [reps, setReps] = useState(quest.currentReps ?? 0);

  useEffect(() => {
    setReps(quest.currentReps ?? 0);
  }, [quest.currentReps]);

  const increment = () => {
    const newReps = reps + 1;
    setReps(newReps);
    onUpdateReps(quest.id, newReps);
  };

  const decrement = () => {
    if (reps > 0) {
      const newReps = reps - 1;
      setReps(newReps);
      onUpdateReps(quest.id, newReps);
    }
  };

  const handleComplete = () => {
    onComplete(quest.id);
    onClose();
  };

  const canComplete = reps >= targetReps && !quest.completed;
  const progress = Math.min(100, (reps / Math.max(targetReps, 1)) * 100);
  const isPlankOrWallSit = quest.exercise === 'plank' || quest.exercise === 'wallsit';
  const exerciseName = quest.exercise.charAt(0).toUpperCase() + quest.exercise.slice(1);
  const isExtra = reps > targetReps;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-void/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm panel-glow clip-hex scanlines"
        style={{
          background: 'var(--bg-panel)',
          animation: 'borderPulse 2.5s ease-in-out infinite',
        }}
      >
        {/* Corner glow accents */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-blue-glow opacity-80" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-glow opacity-80" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-glow opacity-80" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-glow opacity-80" />

        <div className="relative z-10 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 shrink-0"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-glow)',
                boxShadow: '0 0 8px var(--blue-glow)',
              }}
            >
              <span className="font-heading font-bold text-base" style={{ color: 'var(--blue-glow)' }}>
                !
              </span>
            </div>
            <span
              className="font-heading text-sm uppercase"
              style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
            >
              Notification
            </span>
          </div>

          {/* Divider line */}
          <div className="relative h-px" style={{ background: 'var(--blue-dim)' }}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue-glow)' }} />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue-glow)' }} />
          </div>

          {/* Quest info */}
          <div className="space-y-1">
            <div className="text-center">
              <span className="font-heading text-xs uppercase" style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em' }}>
                Quest
              </span>
            </div>
            <div className="text-center">
              <span className="font-heading text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {quest.name}
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm font-body font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Exercise: {exerciseName}
              </span>
            </div>
          </div>

          {/* Exercise emoji */}
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl"
            >
              {exerciseEmojis[quest.exercise] || '⚔️'}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="text-xs font-body font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Progress: {reps}/{targetReps}
            </div>
            <div className="relative h-3 overflow-hidden" style={{ background: 'var(--blue-ghost)', border: '1px solid var(--blue-dim)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bar-shimmer"
                style={{
                  background: canComplete
                    ? 'var(--green-done)'
                    : 'var(--blue-core)',
                  boxShadow: canComplete
                    ? '0 0 8px var(--green-done)'
                    : '0 0 8px var(--blue-core)',
                }}
              />
            </div>
            <div className="text-center text-sm font-body font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(progress)}%
              {isExtra && (
                <span className="ml-2" style={{ color: 'var(--text-accent)' }}>
                  +{reps - targetReps} extra
                </span>
              )}
            </div>
          </div>

          {/* XP Reward */}
          <div className="text-center">
            <span className="font-body font-semibold text-sm" style={{ color: 'var(--bar-xp)' }}>
              +{quest.xpReward ?? 10} XP on completion
            </span>
          </div>

          {/* Warning text when not complete */}
          {!canComplete && !quest.completed && (
            <div className="text-center">
              <span
                className="font-heading text-xs uppercase warning-blink"
                style={{ letterSpacing: '0.15em' }}
              >
                WARNING
              </span>
            </div>
          )}

          {/* Rep Counter */}
          <div className="flex items-center justify-center gap-5 py-2">
            <button
              onClick={decrement}
              disabled={reps <= 0}
              className="w-12 h-12 flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                color: 'var(--text-primary)',
                boxShadow: '0 0 4px var(--blue-dim)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--blue-dim)';
                e.currentTarget.style.boxShadow = '0 0 8px var(--blue-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--blue-ghost)';
                e.currentTarget.style.boxShadow = '0 0 4px var(--blue-dim)';
              }}
            >
              −
            </button>

            <div className="text-center min-w-[80px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reps}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="font-mono font-bold text-4xl"
                  style={{
                    color: canComplete ? 'var(--green-done)' : 'var(--text-accent)',
                    textShadow: canComplete
                      ? '0 0 10px var(--green-done)'
                      : '0 0 8px var(--text-accent)',
                  }}
                >
                  {reps}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs font-body font-semibold" style={{ color: 'var(--text-muted)' }}>
                {isPlankOrWallSit ? 'seconds' : 'reps'}
              </div>
            </div>

            <button
              onClick={increment}
              className="w-12 h-12 flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                color: 'var(--text-accent)',
                boxShadow: '0 0 4px var(--blue-dim)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--blue-dim)';
                e.currentTarget.style.borderColor = 'var(--blue-glow)';
                e.currentTarget.style.boxShadow = '0 0 10px var(--blue-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--blue-ghost)';
                e.currentTarget.style.borderColor = 'var(--blue-dim)';
                e.currentTarget.style.boxShadow = '0 0 4px var(--blue-dim)';
              }}
            >
              +
            </button>
          </div>

          {/* Claim Victory Button */}
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="w-full h-12 font-heading text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: quest.completed
                ? 'var(--green-done)'
                : canComplete
                ? 'var(--blue-ghost)'
                : 'transparent',
              border: quest.completed
                ? '1px solid var(--green-done)'
                : canComplete
                ? '1px solid var(--blue-glow)'
                : '1px solid var(--blue-dim)',
              color: quest.completed
                ? 'var(--bg-void)'
                : canComplete
                ? 'var(--text-primary)'
                : 'var(--text-muted)',
              boxShadow: canComplete
                ? '0 0 12px var(--blue-glow)'
                : 'none',
            }}
            onMouseEnter={e => {
              if (canComplete && !quest.completed) {
                e.currentTarget.style.background = 'var(--blue-core)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--blue-glow)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={e => {
              if (canComplete && !quest.completed) {
                e.currentTarget.style.background = 'var(--blue-ghost)';
                e.currentTarget.style.boxShadow = '0 0 12px var(--blue-glow)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {quest.completed ? '✓ Quest Completed' : '🏆 Claim Victory'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}