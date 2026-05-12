import { useState } from 'react';

interface ActivationScreenProps {
  onActivate: (name: string, bonusStats: { str: number; sta: number; agi: number; vit: number }, difficulty: string) => void;
}

export function ActivationScreen({ onActivate }: ActivationScreenProps) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('D');
  const [bonuses, setBonuses] = useState({ str: 0, sta: 0, agi: 0, vit: 0 });
  const totalBonus = 10;

  const usedPoints = bonuses.str + bonuses.sta + bonuses.agi + bonuses.vit;
  const remainingPoints = totalBonus - usedPoints;

  const difficultyOptions = [
    { value: 'E', label: 'E - Casual', desc: 'Light training. Minimal reps.' },
    { value: 'D', label: 'D - Normal', desc: 'Standard hunting ground.' },
    { value: 'C', label: 'C - Hard', desc: 'Challenging dungeons.' },
    { value: 'B', label: 'B - Veteran', desc: 'For seasoned hunters.' },
    { value: 'A', label: 'A - Expert', desc: 'Near the top.' },
    { value: 'S', label: 'S - Insane', desc: 'Only the strongest survive.' },
  ];

  const increment = (stat: keyof typeof bonuses) => {
    if (usedPoints < totalBonus) {
      setBonuses(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
    }
  };

  const decrement = (stat: keyof typeof bonuses) => {
    if (bonuses[stat] > 0) {
      setBonuses(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
    }
  };

  const handleActivate = () => {
    if (name.trim()) {
      onActivate(name.trim(), bonuses, difficulty);
    }
  };

  return (
    <div className="activation-screen">
      <div className="activation-title">[SYSTEM ACTIVATING...]</div>
      <div className="activation-subtitle">"The System has chosen you."</div>

      <div className="activation-form">
        <input
          type="text"
          className="input-field"
          placeholder="Enter Hunter Name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />

        {/* Difficulty Selector */}
        <div className="difficulty-section">
          <div className="bonus-points-title">Select Your Difficulty</div>
          <div className="difficulty-grid">
            {difficultyOptions.map(opt => (
              <button
                key={opt.value}
                className={`difficulty-btn ${difficulty === opt.value ? 'selected' : ''}`}
                onClick={() => setDifficulty(opt.value)}
              >
                <span className="difficulty-rank">{opt.value}</span>
                <span className="difficulty-label">{opt.label.split(' - ')[1]}</span>
                <span className="difficulty-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bonus-points-section">
          <div className="bonus-points-title">Allocate Initial Stats</div>
          <div className="bonus-points-remaining">{remainingPoints} Points Remaining</div>

          <div className="stat-allocator">
            {(['str', 'sta', 'agi', 'vit'] as const).map(stat => (
              <div key={stat} className="stat-allocate-row">
                <span className="stat-name">
                  {stat === 'str' ? 'STR' : stat === 'sta' ? 'STA' : stat === 'agi' ? 'AGI' : 'VIT'}
                </span>
                <span className="stat-value">{bonuses[stat]}</span>
                <div className="stat-buttons">
                  <button
                    className="stat-btn minus"
                    onClick={() => decrement(stat)}
                    disabled={bonuses[stat] === 0}
                  >
                    -
                  </button>
                  <button
                    className="stat-btn plus"
                    onClick={() => increment(stat)}
                    disabled={usedPoints >= totalBonus}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="activate-btn"
          onClick={handleActivate}
          disabled={!name.trim() || remainingPoints > 0}
        >
          Awaken the System
        </button>
      </div>
    </div>
  );
}
