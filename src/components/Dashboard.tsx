import { Hunter, DailyState, RANK_COLORS } from '../types';

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

  const statImages = {
    str: '/assets/stat-strength.png',
    sta: '/assets/stat-stamina.png',
    agi: '/assets/stat-agility.png',
    vit: '/assets/stat-vitality.png',
  };

  const statLabels = {
    str: 'Strength',
    sta: 'Stamina',
    agi: 'Agility',
    vit: 'Vitality',
  };

  return (
    <div className="dashboard">
      <div className="hunter-card">
        <div className="hunter-header">
          <div
            className="hunter-avatar"
            style={{ borderColor: RANK_COLORS[hunter.rank] }}
          >
            ⚔️
          </div>
          <div className="hunter-info">
            <div className="hunter-name">{hunter.name}</div>
            <div className="hunter-title" style={{ color: RANK_COLORS[hunter.rank] }}>
              {getTitle()}
            </div>
          </div>
          <div
            className="rank-badge"
            style={{
              color: RANK_COLORS[hunter.rank],
              borderColor: RANK_COLORS[hunter.rank],
            }}
          >
            {hunter.rank}
          </div>
        </div>

        <div className="stats-grid">
          {(Object.keys(hunter.stats) as Array<keyof typeof hunter.stats>).map(stat => {
            return (
              <div key={stat} className="stat-block">
                <div className={`stat-icon ${stat}`}>
                  <img src={statImages[stat]} alt={statLabels[stat]} className="w-[18px] h-[18px] object-contain" />
                </div>
                <div className="stat-info">
                  <div className="stat-label">{statLabels[stat]}</div>
                  <div className="stat-number">{hunter.stats[stat]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="daily-progress">
        <div className="section-title">Daily Hunt Progress</div>
        <div className="progress-stats">
          <div className="progress-stat">
            <div className="progress-value">
              {dailyState?.questsCompleted ?? 0}
            </div>
            <div className="progress-label">Quests Cleared</div>
          </div>
          <div className="progress-stat">
            <div className="progress-value">
              {dailyState?.quests.length ?? 0}
            </div>
            <div className="progress-label">Total Quests</div>
          </div>
          <div className="progress-stat">
            <div className="progress-value">{hunter.streak}</div>
            <div className="progress-label">Day Streak</div>
          </div>
        </div>
        <button className="daily-quests-btn" onClick={onOpenQuests}>
          View Today's Quests
        </button>
      </div>
    </div>
  );
}