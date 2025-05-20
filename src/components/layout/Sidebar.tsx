import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  X, 
  LogOut,
  Package,
  Truck,
  UserCheck,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Navigation items based on user role
  const navigationItems = user?.role === UserRole.ADMIN 
    ? [
        // Admin Navigation
        { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Agent Performance', path: '/admin/agent-performance', icon: UserCheck },
        { name: 'Assign Couriers', path: '/admin/assign-courier', icon: Truck },
        { name: 'Order Tracker', path: '/admin/order-tracker', icon: Package },
        { name: 'Settings', path: '/admin/settings', icon: Settings }
      ]
    : [
        // Agent Navigation
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Orders', path: '/orders', icon: ShoppingBag },
        { name: 'Create Order', path: '/create-order', icon: ShoppingBag },
      ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header with logo and close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="text-xl font-bold text-primary-600">Bridge Sales</div>
          <button
            className="p-1 rounded-md lg:hidden"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="p-4">
          {/* User profile section */}
          {user && (
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b dark:border-gray-700">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</div>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout button at bottom of sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
