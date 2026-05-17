import { Hunter, DailyState, RANK_COLORS } from '../types';
import { Button } from './ui/button';

interface DashboardProps {
  hunter: Hunter;
  dailyState: DailyState | null;
  onOpenQuests: () => void;
}

export function Dashboard({ hunter, dailyState, onOpenQuests }: DashboardProps) {
  const getTitle = () => {
    const titles: Record<string, string> = {
      'E': 'Novice Hunter',
      'D': 'Rising Hunter',
      'C': 'Elite Hunter',
      'B': 'Master Hunter',
      'A': 'Ace Hunter',
      'S': 'National-level Hunter',
    };
    return titles[hunter.rank] || 'Hunter';
  };

  const rankColor = RANK_COLORS[hunter.rank];

  // XP calculation
  const level = hunter.level || 1;
  const xpForNextLevel = level * 100;
  const currentXp = hunter.xp || 0;

  // HP as XP bar
  const hpPercent = Math.min((currentXp / xpForNextLevel) * 100, 100);
  const mpPercent = 10; // Static for now

  const completedQuests = dailyState?.questsCompleted ?? 0;
  const totalQuests = dailyState?.quests?.length ?? 0;
  const streak = hunter.streak ?? 0;

  // Stats
  const str = hunter.stats?.str ?? 0;
  const vit = hunter.stats?.vit ?? 0;
  const agi = hunter.stats?.agi ?? 0;
  const sta = hunter.stats?.sta ?? 0;

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen" style={{ background: 'var(--bg-void)' }}>
      {/* Main Stats Panel */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--bg-panel)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--blue-dim)',
          boxShadow: '0 0 20px rgba(30, 144, 255, 0.15), 0 0 40px rgba(30, 144, 255, 0.05)',
          clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
          animation: 'borderPulse 2.5s ease-in-out infinite, systemBoot 400ms ease-out',
        }}
      >
        {/* Scanlines overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 150, 255, 0.03) 2px, rgba(0, 150, 255, 0.03) 4px)',
          }}
        />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Rank badge */}
              <div
                className="w-12 h-12 flex items-center justify-center font-heading text-xl font-bold"
                style={{
                  color: rankColor,
                  border: `2px solid ${rankColor}`,
                  background: 'var(--blue-ghost)',
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  textShadow: `0 0 10px ${rankColor}`,
                  animation: 'borderPulse 2.5s ease-in-out infinite',
                }}
              >
                {hunter.rank}
              </div>

              <div>
                <div
                  className="font-heading text-base tracking-widest uppercase"
                  style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
                >
                  {hunter.name}
                </div>
                <div
                  className="font-body text-xs tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {getTitle()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-5 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--blue-dim) 20%, var(--blue-dim) 80%, transparent)',
          }}
        />

        {/* HP/MP Bars */}
        <div className="px-5 py-4">
          <div className="space-y-3">
            {/* HP Bar (XP) */}
            <div className="flex items-center gap-3">
              <span
                className="font-body text-xs font-semibold w-8 uppercase"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em' }}
              >
                HP
              </span>
              <div
                className="flex-1 h-5 relative overflow-hidden"
                style={{
                  background: 'var(--blue-ghost)',
                  border: '1px solid var(--blue-dim)',
                }}
              >
                <div
                  className="h-full relative"
                  style={{
                    width: `${hpPercent}%`,
                    background: 'var(--bar-hp)',
                    boxShadow: '0 0 10px var(--bar-hp)',
                  }}
                >
                  {/* Shimmer overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'barShimmer 2s linear infinite',
                    }}
                  />
                </div>
              </div>
              <span
                className="font-mono text-sm w-20 text-right"
                style={{ color: 'var(--text-accent)' }}
              >
                {currentXp}/{xpForNextLevel}
              </span>
            </div>

            {/* MP Bar */}
            <div className="flex items-center gap-3">
              <span
                className="font-body text-xs font-semibold w-8 uppercase"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em' }}
              >
                MP
              </span>
              <div
                className="flex-1 h-5 relative overflow-hidden"
                style={{
                  background: 'var(--blue-ghost)',
                  border: '1px solid var(--blue-dim)',
                }}
              >
                <div
                  className="h-full relative"
                  style={{
                    width: `${mpPercent}%`,
                    background: 'var(--bar-mp)',
                    boxShadow: '0 0 10px var(--bar-mp)',
                  }}
                >
                  {/* Shimmer overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'barShimmer 2s linear infinite',
                    }}
                  />
                </div>
              </div>
              <span
                className="font-mono text-sm w-20 text-right"
                style={{ color: 'var(--text-accent)' }}
              >
                {mpPercent}/100
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-3">
            {/* STR */}
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  color: 'var(--blue-glow)',
                  filter: 'drop-shadow(0 0 4px var(--blue-glow))',
                  animation: 'borderPulse 2.5s ease-in-out infinite',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-body text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
                >
                  STR
                </span>
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: 'var(--text-accent)' }}
                >
                  {str}
                </span>
              </div>
            </div>

            {/* VIT */}
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  color: 'var(--bar-hp)',
                  filter: 'drop-shadow(0 0 4px var(--bar-hp))',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-body text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
                >
                  VIT
                </span>
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: 'var(--text-accent)' }}
                >
                  {vit}
                </span>
              </div>
            </div>

            {/* AGI */}
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  color: 'var(--blue-glow)',
                  filter: 'drop-shadow(0 0 4px var(--blue-glow))',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-body text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
                >
                  AGI
                </span>
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: 'var(--text-accent)' }}
                >
                  {agi}
                </span>
              </div>
            </div>

            {/* STA */}
            <div
              className="flex items-center gap-3 p-3"
              style={{
                background: 'var(--blue-ghost)',
                border: '1px solid var(--blue-dim)',
                clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  color: 'var(--bar-mp)',
                  filter: 'drop-shadow(0 0 4px var(--bar-mp))',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-body text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
                >
                  STA
                </span>
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: 'var(--text-accent)' }}
                >
                  {sta}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Panel */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--bg-panel)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--blue-dim)',
          boxShadow: '0 0 15px rgba(30, 144, 255, 0.1)',
          clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
          animation: 'systemBoot 400ms ease-out 100ms both',
        }}
      >
        {/* Scanlines */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 150, 255, 0.03) 2px, rgba(0, 150, 255, 0.03) 4px)',
          }}
        />

        <div className="relative px-5 py-4">
          {/* Title */}
          <div
            className="font-heading text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
          >
            <span style={{ color: 'var(--blue-glow)' }}>⚔</span>
            <span>DAILY PROGRESS</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: 'var(--text-accent)' }}
              >
                {completedQuests}
              </div>
              <div
                className="font-body text-xs uppercase mt-1"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
              >
                Cleared
              </div>
            </div>

            <div className="text-center">
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: 'var(--bar-xp)' }}
              >
                {totalQuests}
              </div>
              <div
                className="font-body text-xs uppercase mt-1"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
              >
                Total
              </div>
            </div>

            <div className="text-center">
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: 'var(--bar-hp)' }}
              >
                {streak}
              </div>
              <div
                className="font-body text-xs uppercase mt-1"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
              >
                Streak
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full h-12 font-heading text-sm tracking-widest uppercase transition-all duration-200"
            style={{
              background: 'transparent',
              border: '1px solid var(--blue-glow)',
              color: 'var(--blue-glow)',
              letterSpacing: '0.15em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--blue-glow)';
              e.currentTarget.style.color = 'var(--bg-void)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--blue-glow)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={onOpenQuests}
          >
            VIEW QUESTS
          </Button>
        </div>
      </div>
    </div>
  );
}
