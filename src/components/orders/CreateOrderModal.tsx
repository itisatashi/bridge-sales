import React, { useState, useEffect } from 'react';
import { useOrdersStore } from '@/store/orders.store';
import type { Product, Store } from '@/types';
import { OrderStatus } from '@/types';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderProduct extends Product {
  tempId: string; // Temporary ID for managing products in the form
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  console.log('CreateOrderModal rendered, isOpen:', isOpen, 'at:', new Date().toISOString());
  
  // Add effect to log when props change
  useEffect(() => {
    console.log('CreateOrderModal isOpen prop changed to:', isOpen, 'at:', new Date().toISOString());
  }, [isOpen]);
  // Get stores and createOrder function from the orders store
  const { createOrder } = useOrdersStore();
  
  // Mock stores for the demo (in a real app, you would fetch these from an API)
  const [stores] = useState<Store[]>([
    {
      id: 's1',
      name: 'Grocery Store A',
      address: '123 Main St, City',
      phone: '+1234567890',
    },
    {
      id: 's2',
      name: 'Supermarket B',
      address: '456 Oak Ave, Town',
      phone: '+1987654321',
    },
    {
      id: 's3',
      name: 'Mini Mart C',
      address: '789 Pine Rd, Village',
      phone: '+1122334455',
    },
  ]);
  
  // Mock products for the demo (in a real app, you would fetch these from an API)
  const [availableProducts] = useState<Product[]>([
    {
      id: 'p1',
      name: 'Milk',
      price: 2.99,
      quantity: 1,
    },
    {
      id: 'p2',
      name: 'Bread',
      price: 1.99,
      quantity: 1,
    },
    {
      id: 'p3',
      name: 'Eggs',
      price: 3.49,
      quantity: 1,
    },
    {
      id: 'p4',
      name: 'Cheese',
      price: 4.99,
      quantity: 1,
    },
  ]);
  
  // Form state
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStore(null);
      setOrderProducts([]);
      setError(null);
    }
  }, [isOpen]);
  
  // Calculate total amount
  const totalAmount = orderProducts.reduce(
    (sum, product) => sum + product.price * product.quantity, 
    0
  );
  
  // Add a product to the order
  const handleAddProduct = () => {
    if (availableProducts.length === 0) return;
    
    // Get the first available product
    const product = availableProducts[0];
    
    // Add it to the order with a temporary ID
    setOrderProducts([
      ...orderProducts,
      { 
        ...product, 
        tempId: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        quantity: 1 
      }
    ]);
  };
  
  // Remove a product from the order
  const handleRemoveProduct = (tempId: string) => {
    setOrderProducts(orderProducts.filter(p => p.tempId !== tempId));
  };
  
  // Update product quantity
  const handleQuantityChange = (tempId: string, quantity: number) => {
    setOrderProducts(
      orderProducts.map(p => 
        p.tempId === tempId 
          ? { ...p, quantity: Math.max(1, quantity) } 
          : p
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedStore) {
      setError('Please select a store');
      return;
    }
    
    if (orderProducts.length === 0) {
      setError('Please add at least one product');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare the order data
      const orderData = {
        storeId: selectedStore.id,
        store: selectedStore,
        products: orderProducts.map(({ tempId, ...product }) => product), // Remove tempId
        status: OrderStatus.PENDING,
        totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Create the order
      await createOrder(orderData);
      
      // Close the modal
      onClose();
    } catch (error) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20 dark:border-red-500/50">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {/* Store selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Store
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={selectedStore?.id || ''}
            onChange={(e) => {
              const storeId = e.target.value;
              const store = stores.find(s => s.id === storeId) || null;
              setSelectedStore(store);
            }}
            required
          >
            <option value="">-- Select a store --</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Products section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Products</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>
          
          {orderProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
              No products added. Click "Add Product" to add products to this order.
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orderProducts.map(product => (
                    <tr key={product.tempId}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            onClick={() => handleQuantityChange(product.tempId, product.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{product.quantity}</span>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            onClick={() => handleQuantityChange(product.tempId, product.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${(product.price * product.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleRemoveProduct(product.tempId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Order summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total Amount:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Create Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrderModal;