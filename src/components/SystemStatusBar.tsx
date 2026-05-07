import { Hunter, RANK_COLORS } from '../types';

interface SystemStatusBarProps {
  hunter: Hunter;
}

export function SystemStatusBar({ hunter }: SystemStatusBarProps) {
  const xpForNextLevel = hunter.level * 100;
  const xpPercentage = Math.min((hunter.xp / xpForNextLevel) * 100, 100);

  return (
    <div className="system-status-bar">
      <div
        className="rank-badge"
        style={{
          color: RANK_COLORS[hunter.rank],
          borderColor: RANK_COLORS[hunter.rank],
          boxShadow: `0 0 10px ${RANK_COLORS[hunter.rank]}40`,
        }}
      >
        {hunter.rank}
      </div>
      <div className="level-info">
        <div className="level-text">Level {hunter.level}</div>
        <div className="xp-bar-container">
          <div
            className="xp-bar-fill"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
        <div className="xp-text">
          {hunter.xp} / {xpForNextLevel} XP
        </div>
      </div>
    </div>
  );
}