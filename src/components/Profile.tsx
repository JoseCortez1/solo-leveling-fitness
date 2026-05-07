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
    <div className="profile-container">
      <div className="rank-progression">
        <div className="section-title">Rank Progression</div>
        <div className="rank-track">
          {RANK_ORDER.map((rank, index) => {
            const isAchieved = index <= currentRankIndex;
            const isCurrent = index === currentRankIndex;
            const color = RANK_COLORS[rank];

            return (
              <div
                key={rank}
                className={`rank-node ${isAchieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}`}
                style={{ color }}
              >
                <div
                  className="rank-circle"
                  style={{
                    color: isAchieved ? color : undefined,
                    borderColor: isAchieved ? color : undefined,
                    background: isCurrent ? undefined : isAchieved ? 'rgba(255,255,255,0.1)' : undefined,
                  }}
                >
                  {rank}
                </div>
                <span className="rank-label">Lv {RANK_THRESHOLDS[rank]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="history-section">
        <div className="section-title">Hunter Statistics</div>
        <div className="history-stats">
          <div className="history-stat">
            <div className="history-stat-value">{hunter.level}</div>
            <div className="history-stat-label">Current Level</div>
          </div>
          <div className="history-stat">
            <div className="history-stat-value">{hunter.xp}</div>
            <div className="history-stat-label">Current XP</div>
          </div>
          <div className="history-stat">
            <div className="history-stat-value">{hunter.streak}</div>
            <div className="history-stat-label">Day Streak</div>
          </div>
          <div className="history-stat">
            <div className="history-stat-value">{getDaysSinceCreation()}</div>
            <div className="history-stat-label">Days Active</div>
          </div>
        </div>
      </div>

      <div className="history-section">
        <div className="section-title">Hunter Profile</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hunter Name</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{hunter.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Current Rank</span>
            <span style={{ color: RANK_COLORS[hunter.rank], fontWeight: 600 }}>{hunter.rank}-Rank</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Stats</span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
              {hunter.stats.str + hunter.stats.sta + hunter.stats.agi + hunter.stats.vit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}