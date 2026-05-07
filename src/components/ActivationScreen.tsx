import { useState } from 'react';

interface ActivationScreenProps {
  onActivate: (name: string, bonusStats: { str: number; sta: number; agi: number; vit: number }) => void;
}

export function ActivationScreen({ onActivate }: ActivationScreenProps) {
  const [name, setName] = useState('');
  const [bonuses, setBonuses] = useState({ str: 0, sta: 0, agi: 0, vit: 0 });
  const totalBonus = 10;

  const usedPoints = bonuses.str + bonuses.sta + bonuses.agi + bonuses.vit;
  const remainingPoints = totalBonus - usedPoints;

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
      onActivate(name.trim(), bonuses);
    }
  };

  return (
    <div className="activation-screen">
      <div className="activation-title">System Activation</div>
      <div className="activation-subtitle">Initializing Hunter Profile...</div>

      <div className="activation-form">
        <input
          type="text"
          className="input-field"
          placeholder="Enter Hunter Name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />

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