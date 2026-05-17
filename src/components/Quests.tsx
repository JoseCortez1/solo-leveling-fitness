import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { DailyState, Quest } from '../types';

interface QuestsProps {
  dailyState: DailyState;
  onQuestClick?: (quest: Quest) => void;
}

export function Quests({ dailyState, onQuestClick: _onQuestClick }: QuestsProps) {
  if (!dailyState) return null;

  const allCompleted = dailyState.questsCompleted === dailyState.quests.length;

  return (
    <div className="space-y-4">
      {/* Quest Info Panel */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.02, filter: 'brightness(3)' }}
        animate={{ opacity: 1, scaleY: 1, filter: 'brightness(1)' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d', transform: 'perspective(800px) rotateX(3deg)' }}
        className="relative bg-bg-panel border border-blue-dim shadow-lg overflow-hidden clip-hex"
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none z-10" />

        {/* Panel glow border pulse */}
        <div className="absolute inset-0 pointer-events-none animate-pulse-glow" style={{ boxShadow: 'inset 0 0 30px rgba(0, 191, 255, 0.1)' }} />

        {/* Header */}
        <div className="relative px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-ghost border border-blue-glow flex items-center justify-center">
              <span className="text-blue-core font-mono text-sm font-bold">!</span>
            </div>
            <h2 className="font-heading text-xs tracking-[0.2em] text-text-primary">
              QUEST INFO
            </h2>
          </div>

          {/* Animated divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="h-px bg-gradient-to-r from-blue-glow via-blue-dim to-transparent mt-2"
          />
        </div>

        {/* Quest arrival message */}
        <div className="px-4 py-2">
          <p className="text-text-secondary text-sm font-body">
            <span className="text-text-accent">[</span>
            Daily Quest: Strength Training has arrived.
            <span className="text-text-accent">]</span>
          </p>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-blue-dim" />

        {/* GOAL section */}
        <div className="px-4 py-3">
          <h3 className="font-heading text-[10px] tracking-[0.3em] text-text-muted mb-3 text-center">
            GOAL
          </h3>

          <div className="space-y-2">
            {dailyState.quests.map((quest, index) => {
              const currentReps = quest.currentReps ?? 0;
              const targetReps = quest.targetReps ?? 1;
              const isPlankOrWallSit = quest.exercise === 'plank' || quest.exercise === 'wallsit';
              const unit = isPlankOrWallSit ? 'sec' : 'reps';

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {/* Exercise name */}
                  <div className={`flex-1 ${quest.completed ? 'opacity-50' : ''}`}>
                    <span
                      className={`font-body text-sm tracking-wide ${
                        quest.completed
                          ? 'line-through text-text-muted'
                          : 'text-text-primary'
                      }`}
                    >
                      {quest.name}
                    </span>
                  </div>

                  {/* Progress bracket */}
                  <div className="flex items-center gap-1">
                    <span className="text-text-accent font-mono text-xs">
                      [{currentReps}/{targetReps}]
                    </span>
                    <span className="text-text-muted text-xs">{unit}</span>
                  </div>

                  {/* Completed checkmark */}
                  {quest.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="w-5 h-5 flex items-center justify-center"
                    >
                      <Check
                        size={14}
                        className="text-green-done drop-shadow-[0_0_4px_rgba(0,255,136,0.6)]"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-blue-dim" />

        {/* Warning section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="px-4 py-3"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              size={14}
              className="text-red-penalty shrink-0 mt-0.5 warning-blink"
              fill="rgba(255, 45, 45, 0.2)"
            />
            <p className="text-red-penalty text-xs font-body warning-blink leading-relaxed">
              WARNING: Failure to complete the daily quest
              <br />
              will result in an appropriate PENALTY.
            </p>
          </div>
        </motion.div>

        {/* Complete button */}
        <div className="px-4 pb-4 pt-2">
          <motion.button
            whileHover={allCompleted ? { scale: 1.02 } : {}}
            whileTap={allCompleted ? { scale: 0.98 } : {}}
            disabled={!allCompleted}
            className={`
              w-full py-3 font-heading text-xs tracking-[0.2em] border transition-all duration-300
              ${
                allCompleted
                  ? 'border-blue-glow bg-blue-ghost/50 text-green-done hover:bg-blue-glow/20 cursor-pointer'
                  : 'border-blue-dim/50 text-text-muted cursor-not-allowed opacity-50'
              }
            `}
          >
            {allCompleted ? '[ ✓ COMPLETE ]' : '[ COMPLETE ]'}
          </motion.button>
        </div>

        {/* All quests cleared bonus banner */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-4 p-3 bg-green-done/10 border border-green-done/30 text-center"
            >
              <span className="font-heading text-xs tracking-wider text-green-done">
                ⚔️ ALL QUESTS CLEARED! +50 Bonus XP Claimed! ⚔️
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}