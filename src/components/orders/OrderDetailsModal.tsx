import React from 'react';
import Modal from '@/components/common/Modal';
import OrderDetails from './OrderDetails';
import { OrderStatus } from '@/types';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { NotificationType } from '@/types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, orderId }) => {
  const { orders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  
  // Find the order by ID
  const order = orders.find(o => o.id === orderId) || null;
  
  // Handle status change
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      // Call updateOrderStatus with the status
      await updateOrderStatus(orderId, status);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Order Updated',
        message: `Order #${orderId} has been marked as ${status}`,
        duration: 5000,
      });
      
      // Close the modal after status change
      onClose();
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Update Failed',
        message: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    }
  };
  
  return (
    <Modal 
      title={order ? `Order #${order.id}` : 'Order Details'}
      isOpen={isOpen && !!order} 
      onClose={onClose} 
      size="lg"
    >
      {order ? (
        <OrderDetails 
          order={order} 
          onClose={onClose}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          {orderId ? 'Order not found' : 'No order selected'}
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
