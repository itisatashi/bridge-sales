import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/common/Button';
import OrderDetails from '@/components/orders/OrderDetails';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { NotificationType, OrderStatus, type Order } from '@/types';

// This is the OrderDetail page for admins
// It shows all the details about a specific order
const OrderDetail: React.FC = () => {
  // Get the orderId from the URL
  const { orderId } = useParams<{ orderId: string }>();
  
  // This helps us navigate to different pages
  const navigate = useNavigate();
  
  // Get functions and data from our stores
  const { orders, fetchOrders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  
  // Set up state to store the order and loading status
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the orders when the page loads
  useEffect(() => {
    const loadOrder = async () => {
      // Show loading state
      setIsLoading(true);
      try {
        // Try to get all orders
        await fetchOrders();
      } catch (error) {
        // If there's an error, show a notification
        addNotification({
          type: NotificationType.ERROR,
          title: 'Error',
          message: 'Failed to load order data',
          duration: 5000,
        });
      } finally {
        // Hide loading state when done
        setIsLoading(false);
      }
    };

    // Call the function to load orders
    loadOrder();
  }, [fetchOrders, addNotification]);

  // When orders are loaded, find the one we want
  useEffect(() => {
    if (orders.length > 0 && orderId) {
      // Find the order with the matching ID
      const foundOrder = orders.find(o => o.id === orderId);
      // Store it in state
      setOrder(foundOrder || null);
    }
  }, [orders, orderId]);

  // Function to handle changing the order status
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      // Update the order status
      await updateOrderStatus(orderId, status);
      
      // Show a success notification
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Order Updated',
        message: `Order #${orderId} has been marked as ${status}`,
        duration: 5000,
      });
    } catch (error) {
      // Show an error notification if it fails
      addNotification({
        type: NotificationType.ERROR,
        title: 'Update Failed',
        message: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    }
  };

  // Function to go back to the orders page
  const handleGoBack = () => {
    navigate('/admin/orders');
  };

  // Render the page
  return (
    <AppLayout>
      {/* Header section */}
      <div className="mb-6">
        {/* Back button */}
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Orders
        </Button>
        
        {/* Page title */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {order ? `Order #${order.id}` : 'Order Details'}
          </h1>
        </div> */}
      </div>

      {/* Content section */}
      {isLoading ? (
        // Show loading spinner
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-primary-500 animate-pulse" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      ) : order ? (
        // Show order details if we found the order
        <OrderDetails 
          order={order} 
          onStatusChange={handleStatusChange}
        />
      ) : (
        // Show error message if order not found
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
