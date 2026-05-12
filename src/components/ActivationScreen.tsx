import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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

  const isStatMaxed = (stat: keyof typeof bonuses) => {
    if (stat === 'str') return bonuses.str >= 5;
    if (stat === 'sta') return bonuses.sta >= 5;
    if (stat === 'agi') return bonuses.agi >= 5;
    if (stat === 'vit') return bonuses.vit >= 5;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#000] via-[#0a1543] to-[#000] flex flex-col items-center justify-center p-6 overflow-y-auto z-50">
      {/* Portal gate decorativo */}
      <img
        src="/assets/portal-gate.png"
        alt=""
        className="absolute opacity-10 animate-[spin_30s_linear_infinite] w-[400px] h-[400px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center gap-6"
      >
        {/* Título con glitch effect */}
        <div className="text-center">
          <h1 className="font-heading text-3xl sm:text-4xl text-accent-gold animate-pulse tracking-wider mb-2">
            [SYSTEM ACTIVATING...]
          </h1>
          <p className="text-accent-blue font-mono text-sm italic">
            "The System has chosen you."
          </p>
        </div>

        {/* Frase del manwha */}
        <Badge variant="default" className="text-center">
          <span className="font-body text-xs tracking-wide">
            私를 사랑하지 않는 이들을 위해 내 힘으로 그것을 증명하겠다
          </span>
        </Badge>

        {/* Form */}
        <Card className="w-full p-6 bg-bg-panel/80 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col gap-6">
            {/* Input nombre */}
            <div className="flex flex-col gap-2">
              <label className="font-heading text-sm text-text-secondary tracking-wide uppercase">
                Hunter Name
              </label>
              <Input
                type="text"
                placeholder="Enter Hunter Name"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
                className="text-center font-heading tracking-wider"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-3">
              <label className="font-heading text-sm text-text-secondary tracking-wide uppercase">
                Select Your Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={`p-2 rounded-lg border text-center transition-all duration-200 ${
                      difficulty === opt.value
                        ? 'border-accent-gold bg-accent-gold/10 shadow-lg shadow-accent-gold/20'
                        : 'border-white/10 bg-bg-panel hover:border-accent-gold/50'
                    }`}
                  >
                    <div className="font-heading text-lg font-bold text-accent-gold">
                      {opt.value}
                    </div>
                    <div className="text-xs text-text-primary uppercase tracking-wider">
                      {opt.label.split(' - ')[1]}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-1">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stat Allocation */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="font-heading text-sm text-text-secondary tracking-wide uppercase">
                  Allocate Initial Stats
                </label>
                <Badge variant={remainingPoints === 0 ? 'success' : 'default'}>
                  <span className="font-mono text-xs">
                    {remainingPoints} Points Remaining
                  </span>
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                {(['str', 'sta', 'agi', 'vit'] as const).map(stat => (
                  <div
                    key={stat}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-primary/50 border border-white/5"
                  >
                    <span className="font-heading text-accent-gold tracking-wider w-12">
                      {stat === 'str' ? 'STR' : stat === 'sta' ? 'STA' : stat === 'agi' ? 'AGI' : 'VIT'}
                    </span>
                    <span className="font-mono text-xl text-text-primary w-8 text-center">
                      {bonuses[stat]}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => decrement(stat)}
                        disabled={bonuses[stat] === 0}
                        className="w-10 h-10 rounded-lg bg-bg-panel border border-white/10 text-text-primary font-bold text-lg hover:border-accent-gold/50 hover:text-accent-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => increment(stat)}
                        disabled={usedPoints >= totalBonus || isStatMaxed(stat)}
                        className="w-10 h-10 rounded-lg bg-bg-panel border border-white/10 text-text-primary font-bold text-lg hover:border-accent-gold/50 hover:text-accent-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de activación */}
            <Button
              variant="gold"
              size="xl"
              onClick={handleActivate}
              disabled={!name.trim() || remainingPoints > 0}
              className="w-full mt-2"
            >
              Awaken the System
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
