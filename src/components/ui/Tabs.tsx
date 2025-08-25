import { ActiveTab } from '../../types';

interface TabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: '📊' },
    { id: 'incoming', label: 'EDL Entrants', icon: '⬅️' },
    { id: 'outgoing', label: 'EDL Sortants', icon: '➡️' },
    { id: 'travaux', label: 'Travaux', icon: '🔧' },
  ];

  return (
    <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
      <div className="flex space-x-2 sm:space-x-4 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}