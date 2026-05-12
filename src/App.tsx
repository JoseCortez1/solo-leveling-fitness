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
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[300px] h-[300px] rounded-full border-2 border-blue-500/30 animate-[spin_20s_linear_infinite]" />
          <div className="w-[250px] h-[250px] rounded-full border-2 border-blue-500/40 animate-[spin_15s_linear_infinite_reverse] -mt-[250px] ml-[25px]" />
          <div className="w-[200px] h-[200px] rounded-full border-2 border-blue-500/50 animate-[spin_12s_linear_infinite] -mt-[200px] ml-[50px]" />
          <div className="w-[100px] h-[100px] rounded-full bg-blue-500/30 blur-xl animate-pulse -mt-[100px] ml-[100px]" />
        </div>
        <div className="shadow-ornament fixed bottom-0 right-0 w-[200px] h-[300px] bg-purple-900/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="shadow-ornament-left fixed top-0 left-0 w-[150px] h-[250px] bg-purple-800/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="scan-line fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent pointer-events-none z-[999] animate-[system-scan_4s_ease-in-out_infinite] opacity-30" />
        <div className="text-center relative z-10">
          <div className="font-heading text-xl text-accent-gold animate-pulse tracking-[0.25em]">[SYSTEM LOADING...]</div>
          <div className="font-body text-xs text-text-secondary mt-4 tracking-[0.125em] uppercase">Initializing Hunter Interface</div>
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="shadow-ornament fixed bottom-0 right-0 w-[200px] h-[300px] bg-purple-900/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="shadow-ornament-left fixed top-0 left-0 w-[150px] h-[250px] bg-purple-800/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="scan-line fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent pointer-events-none z-[999] animate-[system-scan_4s_ease-in-out_infinite] opacity-30" />
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[500] animate-[fade-in_0.3s_ease-out]">
          <div className="text-center animate-[level-up-flash_3s_ease-out_forwards]">
            <div className="font-heading text-5xl text-accent-gold tracking-[0.25em]" style={{textShadow: '0 0 30px #FFD60A, 0 0 60px #FFD60A'}}>[LEVEL UP!]</div>
            <div className="text-7xl font-bold text-accent-gold mt-4">{levelUpLevel}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
