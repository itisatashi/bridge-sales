import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useOrdersStore } from '@/store/orders.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { NotificationType, OrderStatus, type Store, type Product } from '@/types';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { createOrder } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  
  // Store information state
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  
  // Products state
  const [selectedProducts, setSelectedProducts] = useState<(Product & { tempId: string })[]>([]);
  
  // Delivery information state
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock products for demo
  const availableProducts: Product[] = [
    {
      id: 'p1',
      name: 'Milk',
      price: 2.99,
      quantity: 1,
      sku: 'MLK001',
    },
    {
      id: 'p2',
      name: 'Bread',
      price: 1.99,
      quantity: 1,
      sku: 'BRD001',
    },
    {
      id: 'p3',
      name: 'Eggs',
      price: 3.49,
      quantity: 1,
      sku: 'EGG001',
    },
    {
      id: 'p4',
      name: 'Cheese',
      price: 4.99,
      quantity: 1,
      sku: 'CHS001',
    },
  ];
  
  // Calculate total amount
  const totalAmount = selectedProducts.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);
  
  // Add product to order
  const handleAddProduct = (product: Product) => {
    const tempId = Math.random().toString(36).substring(2, 9);
    setSelectedProducts(prev => [
      ...prev,
      { ...product, tempId }
    ]);
  };
  
  // Remove product from order
  const handleRemoveProduct = (tempId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.tempId !== tempId));
  };
  
  // Update product quantity
  const handleUpdateQuantity = (tempId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setSelectedProducts(prev => 
      prev.map(p => 
        p.tempId === tempId 
          ? { ...p, quantity: newQuantity } 
          : p
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!storeName) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: 'Please enter a store name',
        duration: 5000,
      });
      return;
    }
    
    if (selectedProducts.length === 0) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: 'Please add at least one product',
        duration: 5000,
      });
      return;
    }
    
    if (!deliveryAddress) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: 'Please enter a delivery address',
        duration: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create store object
      const store: Store = {
        id: Math.random().toString(36).substring(2, 9),
        name: storeName,
        address: storeAddress,
        phone: storePhone,
      };
      
      // Prepare the order data
      const orderData = {
        storeId: store.id,
        store: store,
        products: selectedProducts.map(({ tempId, ...product }) => product),
        totalAmount,
        deliveryAddress,
        deliveryNotes,
        // Add the missing required properties
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Create the order
      await createOrder(orderData);
      
      addNotification({
        type: NotificationType.SUCCESS,
        title: 'Success',
        message: 'Order created successfully',
        duration: 5000,
      });
      
      // Redirect to orders page
      navigate('/orders');
    } catch (error) {
      addNotification({
        type: NotificationType.ERROR,
        title: 'Error',
        message: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  return (
    <AppLayout>
      <div className="mb-4 flex items-center">
        <Button variant="ghost" onClick={handleCancel} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Create New Order</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information Section */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name*
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter store name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Address
              </label>
              <input
                type="text"
                id="storeAddress"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter store address"
              />
            </div>
            
            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Phone
              </label>
              <input
                type="text"
                id="storePhone"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter store phone"
              />
            </div>
          </div>
        </Card>
        
        {/* Products Section */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Add Products</h2>
          
          {/* Available Products */}
          <div className="space-y-3 mb-6">
            {availableProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</div>
                  <div className="text-sm font-medium">${product.price.toFixed(2)}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddProduct(product)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Selected Products</h3>
              <div className="space-y-3">
                {selectedProducts.map((product) => (
                  <div key={product.tempId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(product.tempId, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(product.tempId, product.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.tempId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
        
        {/* Delivery Information */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Delivery Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Address*
              </label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter delivery address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Notes
              </label>
              <textarea
                id="deliveryNotes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder="Any special instructions for delivery"
              />
            </div>
          </div>
        </Card>
        
        {/* Order Summary */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Products:</span>
              <span>{selectedProducts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
              <span>{selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t dark:border-gray-700">
              <span>Total Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={isSubmitting || selectedProducts.length === 0}
            >
              Create Order
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

export default CreateOrder;