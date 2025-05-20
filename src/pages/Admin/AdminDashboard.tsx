import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, Clock, Package, Truck, ArrowUp } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useOrdersStore } from '@/store/orders.store';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { OrderStatus, NotificationType } from '@/types';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to get badge variant based on order status
const getStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'warning';
    case OrderStatus.PROCESSING:
      return 'info';
    case OrderStatus.SHIPPED:
      return 'primary';
    case OrderStatus.DELIVERED:
      return 'success';
    case OrderStatus.CANCELLED:
      return 'danger';
    default:
      return 'secondary';
  }
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, isLoading } = useOrdersStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationsStore();
  
  // State for dashboard data
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month'>('week');
  const [revenueChange, setRevenueChange] = useState<number>(0);
  
  // Fetch orders when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsStatsLoading(true);
      try {
        await fetchOrders();
        // Simulate a slight delay for loading state
        setTimeout(() => {
          setIsStatsLoading(false);
        }, 800);
      } catch (error) {
        addNotification({
          type: NotificationType.ERROR,
          title: 'Error',
          message: 'Failed to load dashboard data',
          duration: 5000,
        });
        setIsStatsLoading(false);
      }
    };
    
    loadData();
  }, [fetchOrders, addNotification]);
  
  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING).length;
  const processingOrders = orders.filter(order => order.status === OrderStatus.PROCESSING).length;
  const deliveredOrders = orders.filter(order => order.status === OrderStatus.DELIVERED).length;
  const cancelledOrders = orders.filter(order => order.status === OrderStatus.CANCELLED).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Calculate monthly revenue
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Calculate revenue change (mock data for demo)
  useEffect(() => {
    // In a real app, this would compare with actual historical data
    setRevenueChange(comparisonPeriod === 'week' ? 12.5 : 8.3);
  }, [comparisonPeriod]);
  
  // Mock data for agents
  const totalAgents = 8;
  const activeAgents = 6;
  
  // Handle view order
  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  // Handle view all orders
  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };
  
  // Handle assign courier
  const handleAssignCourier = () => {
    navigate('/admin/assign-courier');
  };
  
  // Handle order tracker
  const handleOrderTracker = () => {
    navigate('/admin/order-tracker');
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your sales today.
        </p>
      </div>
      
      {/* Quick action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button
          variant="outline"
          className="flex items-center justify-center h-20"
          onClick={handleViewAllOrders}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          View All Orders
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center h-20"
          onClick={handleAssignCourier}
        >
          <Truck className="mr-2 h-5 w-5" />
          Assign Couriers
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center h-20"
          onClick={handleOrderTracker}
        >
          <Package className="mr-2 h-5 w-5" />
          Track Orders
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mr-4">
              <ShoppingBag className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingOrders}</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
              {isStatsLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Agents</p>
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeAgents}/{totalAgents}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Revenue overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Revenue</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setComparisonPeriod('week')} 
                  className={`px-3 py-1 text-xs rounded-full ${comparisonPeriod === 'week' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setComparisonPeriod('month')} 
                  className={`px-3 py-1 text-xs rounded-full ${comparisonPeriod === 'month' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            {isStatsLoading ? (
              <div className="space-y-4">
                <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(monthlyRevenue)}
                  </p>
                  <p className="text-sm flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">+{revenueChange}% from last {comparisonPeriod}</span>
                  </p>
                </div>
                <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">Revenue chart will be displayed here</p>
                </div>
              </>
            )}
          </div>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Status</h2>
          </div>
          <div className="p-4">
            {isStatsLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting processing</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Processing</p>
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{processingOrders}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered</p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{deliveredOrders}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed orders</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{cancelledOrders}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled orders</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Recent orders */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h2>
          <Button variant="ghost" size="sm" onClick={handleViewAllOrders}>
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : recentOrders.length > 0 ? (
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No orders found</p>
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
