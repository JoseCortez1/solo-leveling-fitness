import { Hunter, DailyState, RANK_COLORS } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
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

  const statGradients = {
    str: 'from-red-500/20 to-red-600/10',
    sta: 'from-green-500/20 to-green-600/10',
    agi: 'from-blue-500/20 to-blue-600/10',
    vit: 'from-purple-500/20 to-purple-600/10',
  };

  const rankColor = RANK_COLORS[hunter.rank];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Hunter Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            {/* Avatar with gradient */}
            <div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center text-2xl shadow-lg shadow-accent-gold/30 shrink-0"
              style={{ border: `2px solid ${rankColor}` }}
            >
              ⚔️
            </div>

            {/* Hunter info */}
            <div className="flex-1 min-w-0">
              <div className="font-heading text-lg text-text-primary truncate">
                {hunter.name}
              </div>
              <div className="text-sm font-medium" style={{ color: rankColor }}>
                {getTitle()}
              </div>
            </div>

            {/* Rank Badge */}
            <Badge
              variant="rank"
              className="text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                color: rankColor,
                borderColor: rankColor,
                backgroundColor: `${rankColor}15`,
              }}
            >
              {hunter.rank}
            </Badge>
          </div>

          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {(Object.keys(hunter.stats) as Array<keyof typeof hunter.stats>).map(stat => {
              return (
                <div
                  key={stat}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${statGradients[stat]} border border-white/5`}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${statGradients[stat]} flex items-center justify-center shrink-0`}>
                    <img
                      src={statImages[stat]}
                      alt={statLabels[stat]}
                      className="w-[18px] h-[18px] object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-xs text-text-secondary font-body">
                      {statLabels[stat]}
                    </div>
                    <div className="text-lg font-bold text-text-primary font-heading">
                      {hunter.stats[stat]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress Card */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-heading text-base text-text-primary mb-4">
            Daily Hunt Progress
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-accent-blue font-heading">
                {dailyState?.questsCompleted ?? 0}
              </div>
              <div className="text-xs text-text-secondary font-body text-center mt-1">
                Quests Cleared
              </div>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-accent-gold font-heading">
                {dailyState?.quests.length ?? 0}
              </div>
              <div className="text-xs text-text-secondary font-body text-center mt-1">
                Total Quests
              </div>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-success font-heading">
                {hunter.streak}
              </div>
              <div className="text-xs text-text-secondary font-body text-center mt-1">
                Day Streak
              </div>
            </div>
          </div>

          <Button variant="blue" className="w-full" onClick={onOpenQuests}>
            View Today's Quests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
