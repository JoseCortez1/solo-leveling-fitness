import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { DailyState, Quest } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface QuestsProps {
  dailyState: DailyState;
  onQuestClick: (quest: Quest) => void;
}

export function Quests({ dailyState, onQuestClick }: QuestsProps) {
  if (!dailyState) return null;

  const allCompleted = dailyState.questsCompleted === dailyState.quests.length;

  return (
    <div className="space-y-4">
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-r from-success/20 via-success/10 to-success/20 border border-success/30 p-4 text-center"
        >
          <span className="text-success font-heading font-bold text-lg">
            ⚔️ ALL QUESTS CLEARED! +50 Bonus XP Claimed! ⚔️
          </span>
        </motion.div>
      )}

      {dailyState.quests.map((quest, index) => {
        const currentReps = quest.currentReps ?? 0;
        const targetReps = quest.targetReps ?? 1;
        const progress = (currentReps / Math.max(targetReps, 1)) * 100;
        const isPlankOrWallSit = quest.exercise === 'plank' || quest.exercise === 'wallsit';

        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all duration-300 ${
                quest.completed
                  ? 'opacity-60 border-success/50 bg-success/5'
                  : 'hover:border-accent-gold/50 hover:bg-accent-gold/5'
              }`}
              onClick={() => !quest.completed && onQuestClick(quest)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-heading font-semibold text-text-primary">
                  {quest.name}
                </span>
                <Badge variant="gold" className="shrink-0">
                  +{quest.xpReward ?? 0} XP
                </Badge>
              </div>

              <p className="text-text-secondary text-sm mb-3">
                {quest.description}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      quest.completed
                        ? 'bg-gradient-to-r from-success to-success/70'
                        : 'bg-gradient-to-r from-accent-gold to-accent-blue'
                    }`}
                  />
                </div>
                <span className="text-text-secondary text-sm font-mono min-w-[60px] text-right">
                  {currentReps} / {targetReps}
                  <span className="text-text-secondary/60 text-xs ml-1">
                    {isPlankOrWallSit ? 'sec' : 'reps'}
                  </span>
                </span>
                {quest.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-success/20"
                  >
                    <Check size={16} className="text-success" />
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
