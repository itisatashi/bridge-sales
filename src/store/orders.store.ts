import { create } from 'zustand';
import { type Order, type OrderFilters, OrderStatus, type Product, type Store } from '@/types';

interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  error: string | null;
  filters: OrderFilters;
}

interface OrdersActions {
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  assignCourier: (orderId: string, courierId: string) => Promise<void>;
  setDeliveryDeadline: (orderId: string, deadline: string) => Promise<void>;
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
}

// Mock data for stores
const mockStores: Store[] = [
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
];

// Mock data for products
const mockProducts: Product[] = [
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
];

// Generate mock orders
const generateMockOrders = (): Order[] => {
  // This is an array of all the possible order statuses
  const statuses = Object.values(OrderStatus);
  // This will hold all our mock orders
  const orders: Order[] = [];

  // Let's create 20 different orders
  for (let i = 1; i <= 20; i++) {
    // Pick a store for this order
    const storeIndex = i % mockStores.length;
    const store = mockStores[storeIndex];
    
    // Pick a status for this order
    const statusIndex = i % statuses.length;
    const status = statuses[statusIndex];

    // Select random products for this order
    const orderProducts: Product[] = [];
    const numProducts = 1 + Math.floor(Math.random() * 3); // 1-3 products per order
    
    for (let j = 0; j < numProducts; j++) {
      const productIndex = (i + j) % mockProducts.length;
      const product = { ...mockProducts[productIndex] };
      product.quantity = 1 + Math.floor(Math.random() * 5); // 1-5 quantity
      orderProducts.push(product);
    }

    // Calculate total amount
    const totalAmount = orderProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // Create date (within last 30 days)
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    // Assign half of the orders to the agent with ID '2' (Dawlet)
    // This ensures the agent will see orders when they log in
    const agentId = i % 2 === 0 ? '2' : '1';
    
    const order: Order = {
      id: `order-${i}`,
      storeId: store.id,
      store: store,
      products: orderProducts,
      status: status,
      totalAmount: totalAmount,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      agentId: agentId,
      assignedTo: agentId, // This ensures orders show up on the agent dashboard
      deliveryAddress: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Maple Ln', 'Cedar Blvd'][i % 5]}, City`,
      notes: i % 3 === 0 ? 'Please deliver ASAP' : i % 3 === 1 ? 'Call before delivery' : ''
    };

    orders.push(order);
  }

  // Add some more products to make the agent's dashboard look better
  const moreProducts: Product[] = [
    { id: 'p5', name: 'Rice', price: 5.99, quantity: 1 },
    { id: 'p6', name: 'Pasta', price: 2.49, quantity: 1 },
    { id: 'p7', name: 'Chicken', price: 7.99, quantity: 1 },
    { id: 'p8', name: 'Beef', price: 9.99, quantity: 1 },
    { id: 'p9', name: 'Fish', price: 8.99, quantity: 1 },
    { id: 'p10', name: 'Vegetables', price: 4.99, quantity: 1 },
    { id: 'p11', name: 'Fruits', price: 6.99, quantity: 1 },
    { id: 'p12', name: 'Juice', price: 3.99, quantity: 1 },
    { id: 'p13', name: 'Water', price: 1.99, quantity: 1 },
    { id: 'p14', name: 'Soda', price: 2.99, quantity: 1 },
  ];

  // Create 10 more orders specifically for the agent (Dawlet)
  for (let i = 21; i <= 30; i++) {
    const storeIndex = i % mockStores.length;
    const store = mockStores[storeIndex];
    
    // For agent orders, use a more realistic distribution of statuses
    // More delivered and processing orders, fewer pending
    let status;
    const statusRoll = Math.random();
    if (statusRoll < 0.4) {
      status = OrderStatus.DELIVERED;
    } else if (statusRoll < 0.7) {
      status = OrderStatus.PROCESSING;
    } else if (statusRoll < 0.85) {
      status = OrderStatus.SHIPPED;
    } else {
      status = OrderStatus.PENDING;
    }

    // Select products for this order from the expanded product list
    const orderProducts: Product[] = [];
    const numProducts = 2 + Math.floor(Math.random() * 3); // 2-4 products per order
    
    for (let j = 0; j < numProducts; j++) {
      // Use both original and new products
      const allProducts = [...mockProducts, ...moreProducts];
      const productIndex = Math.floor(Math.random() * allProducts.length);
      const product = { ...allProducts[productIndex] };
      product.quantity = 1 + Math.floor(Math.random() * 3); // 1-3 quantity
      orderProducts.push(product);
    }

    // Calculate total amount
    const totalAmount = orderProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // Create date (more recent for agent orders - within last 14 days)
    const daysAgo = Math.floor(Math.random() * 14);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    const order: Order = {
      id: `order-${i}`,
      storeId: store.id,
      store: store,
      products: orderProducts,
      status: status,
      totalAmount: totalAmount,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      agentId: '2', // Always assign to Dawlet (agent)
      assignedTo: '2',
      deliveryAddress: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Maple Ln', 'Cedar Blvd'][i % 5]}, City`,
      notes: i % 4 === 0 ? 'Please deliver during business hours' : i % 4 === 1 ? 'Fragile items inside' : i % 4 === 2 ? 'Leave at the door' : ''
    };

    orders.push(order);
  }

  return orders;
};

// Apply filters to orders
const applyFilters = (orders: Order[], filters: OrderFilters): Order[] => {
  return orders.filter((order) => {
    // Filter by status
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    // Filter by store
    if (filters.storeId && order.storeId !== filters.storeId) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      const orderDate = new Date(order.createdAt);
      if (orderDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      const orderDate = new Date(order.createdAt);
      if (orderDate > toDate) {
        return false;
      }
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(searchTerm);
      const matchesStore = order.store.name.toLowerCase().includes(searchTerm);
      const matchesProducts = order.products.some((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );

      if (!matchesId && !matchesStore && !matchesProducts) {
        return false;
      }
    }

    return true;
  });
};

export const useOrdersStore = create<OrdersState & OrdersActions>((set, get) => ({
  // Initial state
  orders: [],
  filteredOrders: [],
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate fetching with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockOrders = generateMockOrders();
      const filteredOrders = applyFilters(mockOrders, get().filters);

      set({
        orders: mockOrders,
        filteredOrders,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching orders',
      });
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate creating an order
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOrder: Order = {
        id: `order-${Math.random().toString(36).substring(2, 9)}`,
        ...orderData,
      };

      set((state) => {
        const updatedOrders = [newOrder, ...state.orders];
        const filteredOrders = applyFilters(updatedOrders, state.filters);
        return {
          orders: updatedOrders,
          filteredOrders,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while creating the order',
      });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate updating an order
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedOrders = state.orders.map((order) =>
          order.id === id
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        );
        const filteredOrders = applyFilters(updatedOrders, state.filters);
        return {
          orders: updatedOrders,
          filteredOrders,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while updating the order',
      });
    }
  },

  assignCourier: async (orderId, courierId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate assigning a courier
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedOrders = state.orders.map((order) =>
          order.id === orderId
            ? { ...order, assignedTo: courierId, updatedAt: new Date().toISOString() }
            : order
        );
        const filteredOrders = applyFilters(updatedOrders, state.filters);
        return {
          orders: updatedOrders,
          filteredOrders,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while assigning the courier',
      });
    }
  },

  setDeliveryDeadline: async (orderId, deadline) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate setting a deadline
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        const updatedOrders = state.orders.map((order) =>
          order.id === orderId
            ? { ...order, deliveryDeadline: deadline, updatedAt: new Date().toISOString() }
            : order
        );
        const filteredOrders = applyFilters(updatedOrders, state.filters);
        return {
          orders: updatedOrders,
          filteredOrders,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred while setting the deadline',
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredOrders = applyFilters(state.orders, updatedFilters);
      return {
        filters: updatedFilters,
        filteredOrders,
      };
    });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredOrders: state.orders,
    }));
  },
}));
