import { useEffect } from 'react';
import { useOrdersStore } from '@/store/orders.store';
import { useAuthStore } from '@/store/auth.store';
import { OrderStatus } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

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

const DashboardPage = () => {
  // Get user from auth store
  const { user } = useAuthStore();
  
  // Get orders and fetch function from orders store
  const { orders, fetchOrders, isLoading } = useOrdersStore();
  
  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING).length;
  const processingOrders = orders.filter(order => order.status === OrderStatus.PROCESSING).length;
  const deliveredOrders = orders.filter(order => order.status === OrderStatus.DELIVERED).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your orders today.
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Pending</h3>
            <p className="text-3xl font-bold text-yellow-500">{pendingOrders}</p>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Processing</h3>
            <p className="text-3xl font-bold text-blue-500">{processingOrders}</p>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Delivered</h3>
            <p className="text-3xl font-bold text-green-500">{deliveredOrders}</p>
          </div>
        </Card>
      </div>
      
      {/* Revenue card */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="text-green-500 font-medium">
            +12.5% from last month
          </div>
        </div>
      </Card>
      
      {/* Recent orders */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        
        {isLoading ? (
          <div className="text-center py-4">Loading orders...</div>
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
};

export default DashboardPage;