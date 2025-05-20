import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { UserRole } from '@/types';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import MobileOnlyLayout from '@/components/layout/MobileOnlyLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Admin Pages
import AdminDashboardPage from '@/pages/Admin/AdminDashboard';
import AdminOrdersPage from '@/pages/Admin/OrdersPage';
import AssignCourierPage from '@/pages/Admin/AssignCourier';
import OrderTrackerPage from '@/pages/Admin/OrderTracker';
import AdminOrderDetailPage from '@/pages/Admin/OrderDetail';
import UsersPage from '@/pages/Admin/UsersPage';
import AgentPerformancePage from '@/pages/Admin/AgentPerformance';

// Agent Pages
import AgentDashboardPage from '@/pages/agent/AgentDashboardPage';
import CreateOrderPage from '@/pages/agent/CreateOrder';
import MyOrdersPage from '@/pages/agent/MyOrders';
import AgentOrderDetailPage from '@/pages/agent/OrderDetail';

// Common Pages
// import ProfilePage from '@/pages/common/ProfilePage';

// Auth Store
import { useAuthStore } from '@/store/auth.store';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has the required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Auth Route Component (redirects to dashboard if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// NotFound Page Component
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
};

// Define routes
const routes: RouteObject[] = [
  // Auth routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        ),
      },
    ],
  },
  
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'orders/:orderId',
        element: <AdminOrderDetailPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'agent-performance',
        element: <AgentPerformancePage />,
      },
      {
        path: 'assign-courier',
        element: <AssignCourierPage />,
      },
      {
        path: 'order-tracker',
        element: <OrderTrackerPage />,
      },
      {
        path: 'profile',
        // element: <ProfilePage />,
      },
    ],
  },
  
  // Agent routes
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.AGENT]}>
        <MobileOnlyLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AgentDashboardPage />,
      },
      {
        path: 'orders',
        element: <MyOrdersPage />,
      },
      {
        path: 'orders/:orderId',
        element: <AgentOrderDetailPage />,
      },
      {
        path: 'create-order',
        element: <CreateOrderPage />,
      },
      {
        path: 'profile',
        // element: <ProfilePage />,
      },
    ],
  },
  
  // 404 Not Found
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Create router
export const router = createBrowserRouter(routes);

export default router;
