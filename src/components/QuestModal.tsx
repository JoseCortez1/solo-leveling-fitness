import { useState, useEffect } from 'react';
import { Quest } from '../types';
import { X } from 'lucide-react';

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

  return (
    <div className="quest-modal-overlay" onClick={onClose}>
      <div className="quest-modal" onClick={e => e.stopPropagation()}>
        <div className="quest-modal-header">
          <span className="quest-modal-title">{quest.name}</span>
          <button className="quest-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="quest-exercise">
          <div className="exercise-icon">
            {exerciseEmojis[quest.exercise] || '⚔️'}
          </div>
          <div className="exercise-name">
            {quest.exercise.charAt(0).toUpperCase() + quest.exercise.slice(1)}
          </div>
          <div className="exercise-target">
            Target: {quest.targetReps} {quest.exercise === 'plank' || quest.exercise === 'wallsit' ? 'seconds' : 'reps'}
          </div>
        </div>

        <div className="rep-counter">
          <button className="rep-btn minus" onClick={decrement}>
            -
          </button>
          <div className="rep-display">
            <div className="rep-current">{reps}</div>
            <div className="rep-target">
              / {quest.targetReps} {quest.exercise === 'plank' || quest.exercise === 'wallsit' ? 'sec' : 'reps'}
            </div>
          </div>
          <button className="rep-btn plus" onClick={increment}>
            +
          </button>
        </div>

        <button
          className="complete-quest-btn"
          onClick={handleComplete}
          disabled={!canComplete}
        >
          {quest.completed ? 'Quest Completed' : 'Claim Victory'}
        </button>
      </div>
    </div>
  );
}