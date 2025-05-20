import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MapPin, Package, CheckCircle, XCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { OrderStatus, NotificationType } from '@/types';

const OrderTracker: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  
  // State for filtering orders
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(OrderStatus.SHIPPED);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for selected order
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  // Get selected order
  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;
  
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
    setSelectedOrderId(orderId);
  };
  
  // Handle mark as delivered
  const handleMarkAsDelivered = async () => {
    if (!selectedOrderId) return;
    
    setIsUpdating(true);
    
    try {
      await updateOrderStatus(selectedOrderId, OrderStatus.DELIVERED);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Success',
        message: `Order #${selectedOrderId} has been marked as delivered`,
        duration: 5000,
      });
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle mark as cancelled
  const handleMarkAsCancelled = async () => {
    if (!selectedOrderId) return;
    
    setIsUpdating(true);
    
    try {
      await updateOrderStatus(selectedOrderId, OrderStatus.CANCELLED);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Success',
        message: `Order #${selectedOrderId} has been marked as cancelled`,
        duration: 5000,
      });
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle view order details
  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
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
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and update the status of orders in transit
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
                      <option value={OrderStatus.SHIPPED}>Shipped</option>
                      <option value={OrderStatus.DELIVERED}>Delivered</option>
                      <option value={OrderStatus.CANCELLED}>Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Orders in Transit</h2>
            
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedOrders.map((order) => (
                      <tr 
                        key={order.id}
                        className={selectedOrderId === order.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                        onClick={() => handleSelectOrder(order.id)}
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
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrderDetails(order.id);
                            }}
                          >
                            View Details
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
        
        {/* Order details section */}
        <div>
          <Card>
            {selectedOrder ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order #{selectedOrder.id}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <Badge variant={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Store</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.store.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="text-gray-900 dark:text-white">${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {selectedOrder.deliveryAddress && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Delivery Address
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  )}
                  
                  {selectedOrder.deliveryNotes && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Delivery Notes</h3>
                      <p className="text-gray-600 dark:text-gray-400">{selectedOrder.deliveryNotes}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Products</h3>
                    <ul className="space-y-2">
                      {selectedOrder.products.map((product) => (
                        <li key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{product.name}</span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400">x{product.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedOrder.status === OrderStatus.SHIPPED && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      <Button
                        variant="primary"
                        className="w-full flex items-center justify-center"
                        disabled={isUpdating}
                        isLoading={isUpdating}
                        onClick={handleMarkAsDelivered}
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Mark as Delivered
                      </Button>
                      
                      <Button
                        variant="danger"
                        className="w-full flex items-center justify-center"
                        disabled={isUpdating}
                        isLoading={isUpdating}
                        onClick={handleMarkAsCancelled}
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Mark as Cancelled
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Order Selected</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Select an order from the list to view details
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderTracker;
