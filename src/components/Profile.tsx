import { Hunter, RANK_ORDER, RANK_COLORS, RANK_THRESHOLDS } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

interface ProfileProps {
  hunter: Hunter;
}

export function Profile({ hunter }: ProfileProps) {
  const { logout } = useAuth();
  const currentRankIndex = RANK_ORDER.indexOf(hunter.rank);

  const getDaysSinceCreation = () => {
    const created = new Date(hunter.createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  return (
    <div className="flex flex-col gap-6 scanlines">
      {/* Rank Progression */}
      <div className="bg-bg-panel clip-hex border border-blue-dim p-6 relative">
        <div className="font-heading text-[0.65rem] text-text-accent uppercase tracking-[0.3em] mb-6">
          ▸ Rank Progression
        </div>
        <div className="flex justify-between items-center mt-3 relative">
          {RANK_ORDER.map((rank, index) => {
            const isAchieved = index <= currentRankIndex;
            const isCurrent = index === currentRankIndex;
            const color = RANK_COLORS[rank];

            return (
              <div
                key={rank}
                className="flex flex-col items-center gap-1 relative z-10"
              >
                <div
                  className={`w-10 h-10 clip-hex flex items-center justify-center font-heading text-sm font-bold border transition-all duration-300 ${
                    isAchieved 
                      ? 'border-current animate-pulse-glow' 
                      : 'border-blue-dim bg-blue-ghost'
                  }`}
                  style={{
                    color: isAchieved ? color : '#7BA7CC',
                    borderColor: isAchieved ? color : undefined,
                    background: isCurrent ? undefined : isAchieved ? 'rgba(255,255,255,0.05)' : '#0D2040',
                    boxShadow: isAchieved ? `0 0 12px ${color}55` : undefined,
                  }}
                >
                  {rank}
                </div>
                <span className={`font-body text-[0.6rem] uppercase tracking-wider ${isAchieved ? 'text-text-primary' : 'text-text-muted'}`}>
                  {RANK_THRESHOLDS[rank]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hunter Statistics */}
      <div className="bg-bg-panel clip-hex border border-blue-dim p-6">
        <div className="font-heading text-[0.65rem] text-text-accent uppercase tracking-[0.3em] mb-6">
          ▸ Hunter Statistics
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-ghost clip-hex border border-blue-dim">
            <div className="text-2xl font-mono text-text-accent">{hunter.level ?? 0}</div>
            <div className="font-body text-[0.65rem] text-text-secondary uppercase mt-2 tracking-wider">Level</div>
          </div>
          <div className="text-center p-3 bg-blue-ghost clip-hex border border-blue-dim">
            <div className="text-2xl font-mono text-text-accent">{hunter.xp ?? 0}</div>
            <div className="font-body text-[0.65rem] text-text-secondary uppercase mt-2 tracking-wider">Current XP</div>
          </div>
          <div className="text-center p-3 bg-blue-ghost clip-hex border border-blue-dim">
            <div className="text-2xl font-mono text-text-accent">{hunter.streak ?? 0}</div>
            <div className="font-body text-[0.65rem] text-text-secondary uppercase mt-2 tracking-wider">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-blue-ghost clip-hex border border-blue-dim">
            <div className="text-2xl font-mono text-text-accent">{getDaysSinceCreation()}</div>
            <div className="font-body text-[0.65rem] text-text-secondary uppercase mt-2 tracking-wider">Days Active</div>
          </div>
        </div>
      </div>

      {/* Hunter Profile */}
      <div className="bg-bg-panel clip-hex border border-blue-dim p-6">
        <div className="font-heading text-[0.65rem] text-text-accent uppercase tracking-[0.3em] mb-6">
          ▸ Hunter Profile
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between items-center p-3 px-4 bg-blue-ghost clip-hex border border-blue-dim">
            <span className="font-body text-[0.8rem] text-text-secondary uppercase tracking-wider">Hunter Name</span>
            <span className="font-mono text-text-accent">{hunter.name}</span>
          </div>
          <div className="flex justify-between items-center p-3 px-4 bg-blue-ghost clip-hex border border-blue-dim">
            <span className="font-body text-[0.8rem] text-text-secondary uppercase tracking-wider">Current Rank</span>
            <span className="font-mono font-bold" style={{ color: RANK_COLORS[hunter.rank] }}>
              {hunter.rank}-RANK
            </span>
          </div>
          <div className="flex justify-between items-center p-3 px-4 bg-blue-ghost clip-hex border border-blue-dim">
            <span className="font-body text-[0.8rem] text-text-secondary uppercase tracking-wider">Total Stats</span>
            <span className="font-mono text-text-accent">
              {(hunter.stats?.str ?? 0) + (hunter.stats?.sta ?? 0) + (hunter.stats?.agi ?? 0) + (hunter.stats?.vit ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="danger"
        size="lg"
        className="w-full clip-hex font-heading tracking-wider"
        onClick={logout}
      >
        [SYSTEM] Disconnect — Logout
      </Button>
    </div>
  );
}