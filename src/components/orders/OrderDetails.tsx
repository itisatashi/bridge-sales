import React from 'react';
import { format } from 'date-fns';
import { Truck, Package, Calendar, DollarSign, MapPin, User } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import type { Order, Product } from '@/types';
import { OrderStatus } from '@/types';

interface OrderDetailsProps {
  order: Order;
  onClose?: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  order, 
  onClose,
  onStatusChange
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'p');
  };

  // Get badge variant based on order status
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

  // Get next status options based on current status
  const getNextStatusOptions = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return [OrderStatus.PROCESSING, OrderStatus.CANCELLED];
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPED:
        return [OrderStatus.DELIVERED, OrderStatus.CANCELLED];
      case OrderStatus.DELIVERED:
        return [];
      case OrderStatus.CANCELLED:
        return [];
      default:
        return [];
    }
  };

  // Handle status change
  const handleStatusChange = (status: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(order.id, status);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order.id}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center p-4">
          <div className="mr-4 p-2 bg-primary-100 dark:bg-primary-900/20 rounded-full">
            <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
          </div>
        </Card>

        <Card className="flex items-center p-4">
          <div className="mr-4 p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
          </div>
        </Card>

        <Card className="flex items-center p-4">
          <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Store</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.store.name}</p>
          </div>
        </Card>

        {order.courierId ? (
          <Card className="flex items-center p-4">
            <div className="mr-4 p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Courier</p>
              <p className="font-medium text-gray-900 dark:text-white">ID: {order.courierId}</p>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center p-4">
            <div className="mr-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <User className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Agent</p>
              <p className="font-medium text-gray-900 dark:text-white">ID: {order.agentId || order.assignedTo || 'N/A'}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Order Items */}
      <Card title="Order Items">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.products.map((product: Product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {product.sku || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(product.price * product.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Subtotal
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Delivery Information */}
      {(order.deliveryAddress || order.deliveryDeadline) && (
        <Card title="Delivery Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.deliveryAddress && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delivery Address</h4>
                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                  {order.deliveryAddress}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delivery Deadline</h4>
              <p className="text-gray-900 dark:text-white">
                {order.deliveryDeadline ? formatDate(order.deliveryDeadline) : 'Not specified'}
              </p>
              {order.deliveryNotes && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Delivery Notes</h4>
                  <p className="text-gray-900 dark:text-white">{order.deliveryNotes}</p>
                </>
              )}
              {order.notes && !order.deliveryNotes && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Order Notes</h4>
                  <p className="text-gray-900 dark:text-white">{order.notes}</p>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Order Actions */}
      {onStatusChange && getNextStatusOptions().length > 0 && (
        <Card title="Order Actions">
          <div className="flex flex-wrap gap-2">
            {getNextStatusOptions().map((status) => (
              <Button
                key={status}
                variant={status === OrderStatus.CANCELLED ? 'danger' : 'primary'}
                onClick={() => handleStatusChange(status)}
              >
                Mark as {status}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderDetails;
