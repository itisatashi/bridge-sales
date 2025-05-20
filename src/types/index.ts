// This file contains all the main types (descriptions of data) we'll use in our app

// UserRole tells us what kind of user someone is
export enum UserRole {
  AGENT = 'agent', // A sales agent who creates orders
  ADMIN = 'admin', // An admin who manages orders and agents
}

// User describes what information we store about a person using our app
export interface User {
  id: string; // A unique ID for each user
  name: string; // The user's full name
  email: string; // The user's email address
  role: UserRole; // Whether they're an AGENT or ADMIN
  avatar?: string; // A picture for the user (? means it's optional)
}

// OrderStatus tells us what stage an order is at
export enum OrderStatus {
  PENDING = 'pending', // Just created, not processed yet
  PROCESSING = 'processing', // Being prepared for delivery
  SHIPPED = 'shipped', // On the way to the customer
  DELIVERED = 'delivered', // Successfully delivered
  CANCELLED = 'cancelled', // Order was cancelled
}

// Product describes an item that can be ordered
export interface Product {
  id: string; // A unique ID for the product
  name: string; // The name of the product
  price: number; // How much it costs
  quantity: number; // How many of this product are in the order
  description?: string; // Product description
  imageUrl?: string; // URL to product image
  category?: string; // Product category
  sku?: string; // Stock keeping unit
}

// Store describes a shop that can place orders
export interface Store {
  id: string; // A unique ID for the store
  name: string; // The name of the store
  address: string; // Where the store is located
  phone: string; // Contact number for the store
}

// Order describes a complete order in our system
export interface Order {
  id: string; // A unique ID for the order
  storeId: string; // Which store placed this order
  store: Store; // All the details about the store
  products: Product[]; // List of products in this order
  status: OrderStatus; // Current status of the order
  totalAmount: number; // Total cost of all products
  createdAt: string; // When the order was created
  updatedAt: string; // When the order was last changed
  courierId?: string; // Who is delivering the order (optional)
  deliveryDeadline?: string; // When it should be delivered by (optional)
  agentId?: string; // ID of the agent who created the order
  assignedTo?: string; // ID of the user the order is assigned to
  deliveryAddress?: string; // Address for delivery
  deliveryNotes?: string; // Notes for delivery
  notes?: string; // General notes about the order
  problemReported?: boolean; // Whether a problem has been reported
  problemDescription?: string; // Description of any problem
}

// OrderFilters helps us search and filter orders
export interface OrderFilters {
  status?: OrderStatus | undefined; // Filter by status (like only PENDING orders)
  storeId?: string | undefined; // Filter by store
  dateFrom?: string | undefined; // Filter by start date
  dateTo?: string | undefined; // Filter by end date
  search?: string | undefined; // Search text in order details
}

// NotificationType tells us what kind of notification it is
export enum NotificationType {
  SUCCESS = 'success', // Something good happened
  ERROR = 'error', // Something went wrong
  WARNING = 'warning', // A warning about something
  INFO = 'info', // Just some information
}

// Notification describes an alert or message for the user
export interface Notification {
  id: string; // A unique ID for the notification
  type: NotificationType; // What kind of notification it is
  message: string; // The main text of the notification
  title?: string; // A title for the notification (optional)
  duration?: number; // How long to show it (in milliseconds)
  createdAt: string; // When the notification was created
  read: boolean; // Whether the user has seen it yet
}
