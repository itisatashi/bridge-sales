import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Tab header styles based on variant
  const getTabHeaderStyles = (isActive: boolean, isDisabled: boolean) => {
    const baseStyles = 'px-4 py-2 text-sm font-medium focus:outline-none transition-colors';
    
    if (isDisabled) {
      return `${baseStyles} text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'pills':
        return isActive
          ? `${baseStyles} bg-primary-600 text-white rounded-md`
          : `${baseStyles} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`;
      
      case 'underline':
        return isActive
          ? `${baseStyles} text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400`
          : `${baseStyles} text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent`;
      
      default: // default variant
        return isActive
          ? `${baseStyles} text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400`
          : `${baseStyles} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent`;
    }
  };

  return (
    <div className={className}>
      {/* Tab headers */}
      <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={getTabHeaderStyles(activeTabId === tab.id, !!tab.disabled)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={activeTabId === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
