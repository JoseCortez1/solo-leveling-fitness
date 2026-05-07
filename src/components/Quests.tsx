import { DailyState, Quest } from '../types';
import { Check } from 'lucide-react';

interface QuestsProps {
  dailyState: DailyState;
  onQuestClick: (quest: Quest) => void;
}

export function Quests({ dailyState, onQuestClick }: QuestsProps) {
  if (!dailyState) return null;

  const allCompleted = dailyState.questsCompleted === dailyState.quests.length;

  return (
    <div className="quests-container">
      {allCompleted && (
        <div className="all-clear-banner">
          ⚔️ ALL QUESTS CLEARED! +50 Bonus XP Claimed! ⚔️
        </div>
      )}

      {dailyState.quests.map((quest, index) => (
        <div
          key={quest.id}
          className={`quest-card ${quest.completed ? 'completed' : ''}`}
          onClick={() => !quest.completed && onQuestClick(quest)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="quest-header">
            <span className="quest-name">{quest.name}</span>
            <span className="quest-xp">+{quest.xpReward} XP</span>
          </div>
          <div className="quest-description">{quest.description}</div>
          <div className="quest-progress">
            <div className="quest-progress-bar">
              <div
                className="quest-progress-fill"
                style={{
                  width: `${(quest.currentReps / quest.targetReps) * 100}%`,
                }}
              />
            </div>
            <span className="quest-progress-text">
              {quest.currentReps} / {quest.targetReps}
            </span>
            {quest.completed && (
              <span className="quest-check">
                <Check size={20} />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}