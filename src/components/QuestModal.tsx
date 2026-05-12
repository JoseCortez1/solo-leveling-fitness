import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Quest } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';

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
  const [reps, setReps] = useState(quest.currentReps);

  useEffect(() => {
    setReps(quest.currentReps);
  }, [quest.currentReps]);

  const increment = () => {
    if (reps < quest.targetReps) {
      const newReps = reps + 1;
      setReps(newReps);
      onUpdateReps(quest.id, newReps);
    }
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

  const canComplete = reps >= quest.targetReps && !quest.completed;
  const progress = (reps / quest.targetReps) * 100;
  const isPlankOrWallSit = quest.exercise === 'plank' || quest.exercise === 'wallsit';
  const exerciseName = quest.exercise.charAt(0).toUpperCase() + quest.exercise.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <Card className="w-full max-w-sm p-6 space-y-6 bg-bg-panel/90 backdrop-blur-xl border-white/20">
          {/* Header */}
          <div className="flex items-start justify-between">
            <span className="font-heading font-bold text-xl text-text-primary pr-4">
              {quest.name}
            </span>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Exercise Icon */}
          <div className="flex flex-col items-center py-4 space-y-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl"
            >
              {exerciseEmojis[quest.exercise] || '⚔️'}
            </motion.div>
            <div className="text-center">
              <span className="font-heading font-semibold text-lg text-text-primary block">
                {exerciseName}
              </span>
              <span className="text-text-secondary text-sm">
                Target: {quest.targetReps} {isPlankOrWallSit ? 'seconds' : 'reps'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-bg-primary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  canComplete
                    ? 'bg-gradient-to-r from-success to-success/70'
                    : 'bg-gradient-to-r from-accent-gold to-accent-blue'
                }`}
              />
            </div>
            <div className="text-center text-text-secondary text-sm">
              {Math.round(progress)}% complete
            </div>
          </div>

          {/* Rep Counter */}
          <div className="flex items-center justify-center gap-6 py-2">
            <button
              onClick={decrement}
              disabled={reps <= 0}
              className="w-14 h-14 rounded-full bg-bg-primary border border-white/20 text-text-primary text-2xl font-bold hover:bg-white/10 hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              −
            </button>

            <div className="text-center min-w-[100px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reps}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`font-mono font-bold text-5xl ${
                    canComplete ? 'text-success' : 'text-accent-gold'
                  }`}
                >
                  {reps}
                </motion.div>
              </AnimatePresence>
              <div className="text-text-secondary text-sm">
                / {quest.targetReps} {isPlankOrWallSit ? 'sec' : 'reps'}
              </div>
            </div>

            <button
              onClick={increment}
              disabled={reps >= quest.targetReps}
              className="w-14 h-14 rounded-full bg-accent-gold/20 border border-accent-gold/30 text-accent-gold text-2xl font-bold hover:bg-accent-gold/30 hover:border-accent-gold/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Claim Victory Button */}
          <Button
            variant={quest.completed ? 'ghost' : canComplete ? 'gold' : 'outline'}
            size="xl"
            className="w-full"
            onClick={handleComplete}
            disabled={!canComplete}
          >
            {quest.completed ? '✓ Quest Completed' : '🏆 Claim Victory'}
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
