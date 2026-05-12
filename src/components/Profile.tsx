import { Hunter, RANK_ORDER, RANK_COLORS, RANK_THRESHOLDS } from '../types';

interface ProfileProps {
  hunter: Hunter;
}

export function Profile({ hunter }: ProfileProps) {
  const currentRankIndex = RANK_ORDER.indexOf(hunter.rank);

  const getDaysSinceCreation = () => {
    const created = new Date(hunter.createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-panel rounded-xl p-6">
        <div className="font-heading text-xs text-accent-blue uppercase tracking-widest mb-4">Rank Progression</div>
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm font-bold border-2 transition-all duration-300 ${isAchieved ? 'border-current' : 'border-bg-secondary bg-bg-secondary'} ${isCurrent ? 'animate-pulse-glow' : ''}`}
                  style={{
                    color: isAchieved ? color : undefined,
                    borderColor: isAchieved ? color : undefined,
                    background: isCurrent ? undefined : isAchieved ? 'rgba(255,255,255,0.1)' : undefined,
                    boxShadow: isAchieved ? `0 0 10px ${color}` : undefined,
                  }}
                >
                  {rank}
                </div>
                <span className={`text-[0.65rem] uppercase ${isAchieved ? 'text-text-primary' : 'text-text-secondary'}`}>Lv {RANK_THRESHOLDS[rank]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl p-6">
        <div className="font-heading text-xs text-accent-blue uppercase tracking-widest mb-4">Hunter Statistics</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-gold">{hunter.level}</div>
            <div className="text-[0.7rem] text-text-secondary uppercase mt-1">Current Level</div>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-gold">{hunter.xp}</div>
            <div className="text-[0.7rem] text-text-secondary uppercase mt-1">Current XP</div>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-gold">{hunter.streak}</div>
            <div className="text-[0.7rem] text-text-secondary uppercase mt-1">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <div className="text-2xl font-bold text-accent-gold">{getDaysSinceCreation()}</div>
            <div className="text-[0.7rem] text-text-secondary uppercase mt-1">Days Active</div>
          </div>
        </div>
      </div>

      <div className="bg-bg-panel rounded-xl p-6">
        <div className="font-heading text-xs text-accent-blue uppercase tracking-widest mb-4">Hunter Profile</div>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex justify-between items-center p-2 px-3 bg-bg-secondary rounded-lg">
            <span className="text-[0.85rem] text-text-secondary">Hunter Name</span>
            <span className="font-semibold text-accent-gold">{hunter.name}</span>
          </div>
          <div className="flex justify-between items-center p-2 px-3 bg-bg-secondary rounded-lg">
            <span className="text-[0.85rem] text-text-secondary">Current Rank</span>
            <span className="font-semibold" style={{ color: RANK_COLORS[hunter.rank] }}>{hunter.rank}-Rank</span>
          </div>
          <div className="flex justify-between items-center p-2 px-3 bg-bg-secondary rounded-lg">
            <span className="text-[0.85rem] text-text-secondary">Total Stats</span>
            <span className="font-semibold text-accent-gold">
              {hunter.stats.str + hunter.stats.sta + hunter.stats.agi + hunter.stats.vit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
