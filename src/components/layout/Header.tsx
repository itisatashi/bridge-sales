import React from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useNotificationsStore } from '@/store/notifications.store';

interface HeaderProps {
  onOpenSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenSidebar, 
  isDarkMode, 
  toggleDarkMode 
}) => {
  const { unreadCount } = useNotificationsStore();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Menu button - only visible on mobile */}
        <button
          className="p-1 rounded-md lg:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo - only visible on mobile */}
        <div className="lg:hidden text-xl font-bold text-primary-600">Bridge Sales</div>

        {/* Right side of header */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications dropdown */}
          <div className="relative">
            <button
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
