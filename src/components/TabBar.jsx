import { motion } from 'framer-motion';

const TABS = [
  { id: 'home', label: '天气', icon: '🌤' },
  { id: 'forecast', label: '预报', icon: '📊' },
  { id: 'calendar', label: '日历', icon: '🗓' },
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              className="tab-indicator"
              layoutId="tab-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
