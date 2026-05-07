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
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon size={20} className="tab-icon" />
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}