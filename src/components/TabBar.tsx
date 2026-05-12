import { LayoutDashboard, ScrollText, User } from 'lucide-react';

export type TabType = 'dashboard' | 'quests' | 'profile';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests', icon: ScrollText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary flex justify-center py-2 z-[100] border-t border-bg-panel">
      <div className="flex gap-1 max-w-md w-full justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center gap-0.5 p-2 min-w-[80px] transition-colors duration-200 border-none bg-transparent cursor-pointer ${isActive ? 'text-accent-gold' : 'text-text-secondary'}`}
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon size={20} className={isActive ? 'drop-shadow-[0_0_4px_var(--accent-gold)]' : ''} />
              <span className="text-[0.7rem] font-semibold uppercase tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
