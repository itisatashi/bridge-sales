import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Truck, User } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { OrderStatus, NotificationType } from '@/types';

// Mock couriers data
const couriers = [
  { id: 'c1', name: 'John Doe', phone: '+1234567890', available: true },
  { id: 'c2', name: 'Jane Smith', phone: '+1987654321', available: true },
  { id: 'c3', name: 'Mike Johnson', phone: '+1122334455', available: false },
  { id: 'c4', name: 'Sarah Williams', phone: '+1555666777', available: true },
];

const AssignCourier: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  
  // State for filtering orders
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(OrderStatus.PROCESSING);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for assigning couriers
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Fetch orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        await fetchOrders();
      } catch (error) {
        addNotification({
          type: NotificationType.ERROR,
          title: 'Error',
          message: 'Failed to load orders',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [fetchOrders, addNotification]);
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.store.name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Helper function to get status badge variant
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle select order
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
    setSelectedCourierId(null);
  };
  
  // Handle select courier
  const handleSelectCourier = (courierId: string) => {
    setSelectedCourierId(courierId);
  };
  
  // Handle assign courier
  const handleAssignCourier = async () => {
    if (!selectedOrderId || !selectedCourierId) {
      addNotification({
        type: NotificationType.WARNING,
        title: 'Warning',
        message: 'Please select both an order and a courier',
        duration: 5000,
      });
      return;
    }
    
    setIsAssigning(true);
    
    try {
      // Find the order
      const order = orders.find(o => o.id === selectedOrderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Update order with courier and change status to SHIPPED
      await updateOrderStatus(selectedOrderId, OrderStatus.SHIPPED);
      
      // In a real app, you would also update the courier ID
      // This is a mock implementation
      console.log(`Assigned courier ${selectedCourierId} to order ${selectedOrderId}`);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Success',
        message: `Courier assigned to order #${selectedOrderId}`,
        duration: 5000,
      });
      
      // Reset selection
      setSelectedOrderId(null);
      setSelectedCourierId(null);
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: `Failed to assign courier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    } finally {
      setIsAssigning(false);
    }
  };
  
  // Handle go back
  const handleGoBack = () => {
    navigate('/admin/dashboard');
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign Couriers</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Assign couriers to process orders for delivery
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders section */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white sm:text-sm"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-shrink-0">
                <div className="relative inline-block text-left">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5 text-gray-400" />
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value={OrderStatus.PENDING}>Pending</option>
                      <option value={OrderStatus.PROCESSING}>Processing</option>
                      <option value={OrderStatus.SHIPPED}>Shipped</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Orders Ready for Delivery</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary-500 border-r-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
              </div>
            ) : sortedOrders.length > 0 ? (
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Select
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedOrders.map((order) => (
                      <tr 
                        key={order.id}
                        className={selectedOrderId === order.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.store.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant={selectedOrderId === order.id ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => handleSelectOrder(order.id)}
                          >
                            {selectedOrderId === order.id ? 'Selected' : 'Select'}
                          </Button>
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
        </div>
        
        {/* Couriers section */}
        <div>
          <Card>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Couriers</h2>
            
            <div className="space-y-4">
              {couriers.map((courier) => (
                <div 
                  key={courier.id}
                  className={`border rounded-lg p-4 ${
                    !courier.available 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
                      : selectedCourierId === courier.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer'
                  }`}
                  onClick={() => courier.available && handleSelectCourier(courier.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{courier.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{courier.phone}</p>
                      <div className="mt-1">
                        {courier.available ? (
                          <Badge variant="success" size="sm">Available</Badge>
                        ) : (
                          <Badge variant="danger" size="sm">Unavailable</Badge>
                        )}
                      </div>
                    </div>
                    {courier.available && (
                      <div className="ml-3 flex-shrink-0">
                        <input
                          type="radio"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedCourierId === courier.id}
                          onChange={() => handleSelectCourier(courier.id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                className="w-full flex items-center justify-center"
                disabled={!selectedOrderId || !selectedCourierId || isAssigning}
                isLoading={isAssigning}
                onClick={handleAssignCourier}
              >
                <Truck className="mr-2 h-5 w-5" />
                Assign Courier
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AssignCourier;
