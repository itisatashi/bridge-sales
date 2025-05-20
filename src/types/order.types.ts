export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  sku?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  contactPerson?: string;
}

export interface Order {
  id: string;
  storeId: string;
  store: Store;
  products: Product[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  courierId?: string;
  assignedTo?: string;
  deliveryDeadline?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  notes?: string;
  problemReported?: boolean;
  problemDescription?: string;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  storeId?: string;
}
