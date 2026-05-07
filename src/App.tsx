import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { TabType } from './components/TabBar';
import { ActivationScreen } from './components/ActivationScreen';
import { SystemStatusBar } from './components/SystemStatusBar';
import { TabBar } from './components/TabBar';
import { Dashboard } from './components/Dashboard';
import { Quests } from './components/Quests';
import { Profile } from './components/Profile';
import { QuestModal } from './components/QuestModal';
import { Quest } from './types';

function App() {
  const {
    hunter,
    dailyState,
    isActivated,
    isLoading,
    showLevelUp,
    levelUpLevel,
    activateSystem,
    updateQuestProgress,
    completeQuest,
  } = useGameState();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  if (isLoading) {
    return <div className="loading">SYSTEM LOADING...</div>;
  }

  if (!isActivated || !hunter) {
    return <ActivationScreen onActivate={activateSystem} />;
  }

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const handleCloseQuest = () => {
    setSelectedQuest(null);
  };

  return (
    <div className="app">
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
            <div className="level-up-text">LEVEL UP</div>
            <div className="level-up-number">{levelUpLevel}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;