import { Hunter, RANK_COLORS } from '../types';

interface SystemStatusBarProps {
  hunter: Hunter;
}

export function SystemStatusBar({ hunter }: SystemStatusBarProps) {
  const level = hunter.level ?? 1;
  const currentXp = hunter.xp ?? 0;
  const xpForNextLevel = Math.max(level * 100, 1);
  const xpPercentage = Math.min((currentXp / xpForNextLevel) * 100, 100);

  return (
    <div className="sticky top-0 bg-bg-secondary z-[100] p-4 flex items-center gap-4"
      style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-secondary) 90%, transparent 100%)'
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-heading text-xl font-bold border-2 flex-shrink-0"
        style={{
          color: RANK_COLORS[hunter.rank],
          borderColor: RANK_COLORS[hunter.rank],
          boxShadow: `0 0 10px ${RANK_COLORS[hunter.rank]}40`,
        }}
      >
        {hunter.rank}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-[0.75rem] text-text-secondary uppercase tracking-widest">Level {level}</div>
        <div className="h-2 bg-bg-panel rounded overflow-hidden relative">
          <div
            className="h-full rounded transition-all duration-500 relative"
            style={{
              width: `${xpPercentage}%`,
              background: 'linear-gradient(90deg, var(--accent-gold), #FFA000)',
            }}
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-5"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4))',
              }}
            />
          </div>
        </div>
        <div className="text-[0.7rem] text-text-secondary mt-0.5 font-mono">
          {currentXp} / {xpForNextLevel} XP
        </div>
      </div>
    </div>
  );
}
