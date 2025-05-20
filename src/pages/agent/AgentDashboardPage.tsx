import React, { useEffect } from 'react';
import { ShoppingBag, TrendingUp, Clock, Calendar } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useOrdersStore } from '@/store/orders.store';
import { useAuthStore } from '@/store/auth.store';
import { OrderStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

const AgentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orders, fetchOrders, isLoading } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders for the current agent
  // We need to check if the order belongs to the current agent
  const agentOrders = orders.filter(order => {
    // Check if the order is assigned to the current user
    // We need to use type assertion here because the Order interface in types/index.ts
    // might not have the assignedTo property defined
    return (order as any).assignedTo === user?.id;
  });
  
  // Calculate statistics
  const totalOrders = agentOrders.length;
  const pendingOrders = agentOrders.filter(order => order.status === OrderStatus.PENDING).length;
  // These variables are used in the statCards array below
  const processingOrdersCount = agentOrders.filter(order => order.status === OrderStatus.PROCESSING).length;
  const deliveredOrdersCount = agentOrders.filter(order => order.status === OrderStatus.DELIVERED).length;
  const totalRevenue = agentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get recent orders (last 5)
  const recentOrders = [...agentOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Stat cards data
  const statCards = [
    {
      title: 'My Orders',
      value: totalOrders,
      icon: <ShoppingBag className="w-8 h-8 text-primary-500" />,
      description: 'Total orders created',
    },
    {
      title: 'Total Sales',
      value: formatCurrency(totalRevenue),
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      description: 'Revenue generated',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      description: 'Awaiting processing',
    },
    // Use the processingOrdersCount variable here
    {
      title: 'Processing Orders',
      value: processingOrdersCount,
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      description: 'In progress',
    },
    // Use the deliveredOrdersCount variable here
    {
      title: 'Delivered Orders',
      value: deliveredOrdersCount,
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      description: 'Completed orders',
    },
    {
      title: 'This Month',
      value: agentOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      }).length,
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      description: 'Orders this month',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card title="Recent Orders">
        {isLoading ? (
          <div className="text-center py-4">Loading recent orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No recent orders found. Create your first order!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.store.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === OrderStatus.DELIVERED
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : order.status === OrderStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : order.status === OrderStatus.PROCESSING
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : order.status === OrderStatus.SHIPPED
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => navigate('/orders?status=pending')}
          >
            Pending Orders
          </Button>
          <Button 
            variant="outline" 
            fullWidth
            onClick={() => navigate('/profile')}
          >
            My Profile
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AgentDashboardPage;
