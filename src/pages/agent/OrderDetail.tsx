import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/common/Button';
import OrderDetails from '@/components/orders/OrderDetails';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { NotificationType, OrderStatus, type Order } from '@/types';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, fetchOrders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        await fetchOrders();
      } catch (error) {
        addNotification({
          type: NotificationType.ERROR,
          title: 'Error',
          message: 'Failed to load order data',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [fetchOrders, addNotification]);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orders, orderId]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Order Updated',
        message: `Order #${orderId} has been marked as ${status}`,
        duration: 5000,
      });
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Update Failed',
        message: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    }
  };

  const handleGoBack = () => {
    navigate('/agent/orders');
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Orders
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {order ? `Order #${order.id}` : 'Order Details'}
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-primary-500 animate-pulse" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      ) : order ? (
        <OrderDetails 
          order={order} 
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Order not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="primary" onClick={handleGoBack} className="mt-4">
            Go Back to Orders
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default OrderDetail;
