import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { TabType } from './components/TabBar';
import { ActivationScreen } from './components/ActivationScreen';
import { SystemStatusBar } from './components/SystemStatusBar';
import { TabBar } from './components/TabBar';
import { Dashboard } from './components/Dashboard';
import { Quests } from './components/Quests';
import { Profile } from './components/Profile';
import { QuestModal } from './components/QuestModal';
import { LoginScreen } from './components/LoginScreen';
import { Quest } from './types';

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [hunter, setHunter] = useState<any>(null);
  const [dailyState, setDailyState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // Load hunter data when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    loadHunterData();
  }, [isAuthenticated]);

  const loadHunterData = async () => {
    try {
      const h = await api.getHunter() as any;
      // Normalize API response (flat str/sta/agi/vit) to nested stats format
      const normalized = {
        ...h,
        stats: {
          str: h.str ?? 5,
          sta: h.sta ?? 5,
          agi: h.agi ?? 5,
          vit: h.vit ?? 5,
        },
      };
      setHunter(normalized);
      const q = await api.getQuests();
      setDailyState(q);
    } catch {
      // No hunter yet — activation screen will show
      setHunter(null);
      setDailyState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async (name: string, bonusStats: { str: number; sta: number; agi: number; vit: number }, difficulty: string) => {
    try {
      const h = await api.activateHunter({
        name,
        str: bonusStats.str,
        sta: bonusStats.sta,
        agi: bonusStats.agi,
        vit: bonusStats.vit,
        difficulty,
      });
      setHunter(h);
      const q = await api.getQuests();
      setDailyState(q);
    } catch (e) {
      console.error('[SYSTEM] Activation failed:', e);
    }
  };

  const updateQuestProgress = async (questId: string, reps: number) => {
    try {
      await api.updateQuestProgress(questId, reps);
      if (dailyState) {
        const updatedQuests = dailyState.quests.map((q: any) =>
          q.id === questId ? { ...q, currentReps: Math.min(reps, q.targetReps) } : q
        );
        setDailyState({ ...dailyState, quests: updatedQuests });
      }
    } catch (e) {
      console.error('[SYSTEM] Progress update failed:', e);
    }
  };

  const completeQuest = async (questId: string) => {
    try {
      const result = await api.completeQuest(questId);
      if (result.levelUp) {
        setLevelUpLevel(result.level);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      // Reload everything
      await loadHunterData();
    } catch (e) {
      console.error('[SYSTEM] Quest completion failed:', e);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="loading-screen">
        <div className="gate-bg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="gate-ring gate-ring-1" />
          <div className="gate-ring gate-ring-2" />
          <div className="gate-ring gate-ring-3" />
          <div className="gate-core" />
        </div>
        <div className="shadow-ornament" />
        <div className="shadow-ornament-left" />
        <div className="scan-line" />
        <div className="loading-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="loading-glitch">[SYSTEM LOADING...]</div>
          <div className="loading-sub">Initializing Hunter Interface</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={loadHunterData} />;
  }

  if (!hunter) {
    return <ActivationScreen onActivate={handleActivate} />;
  }

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const handleCloseQuest = () => {
    setSelectedQuest(null);
  };

  return (
    <div className="app">
      <div className="shadow-ornament" />
      <div className="shadow-ornament-left" />
      <div className="scan-line" />
      <SystemStatusBar hunter={hunter} />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            hunter={hunter}
            dailyState={dailyState}
            onOpenQuests={() => setActiveTab('quests')}
          />
        )}
        {activeTab === 'quests' && dailyState && (
          <Quests
            dailyState={dailyState}
            onQuestClick={handleQuestClick}
          />
        )}
        {activeTab === 'profile' && (
          <Profile hunter={hunter} />
        )}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {selectedQuest && (
        <QuestModal
          quest={selectedQuest}
          onClose={handleCloseQuest}
          onUpdateReps={updateQuestProgress}
          onComplete={completeQuest}
        />
      )}

      {showLevelUp && levelUpLevel && (
        <div className="level-up-overlay">
          <div className="level-up-content">
            <div className="level-up-text">[LEVEL UP!]</div>
            <div className="level-up-number">{levelUpLevel}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
