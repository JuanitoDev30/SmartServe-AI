// ============================================
// CHAT TYPES
// ============================================

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
  about?: string;
}

export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  contact: Contact;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  pinned?: boolean;
}

// ============================================
// ORDER/DASHBOARD TYPES
// ============================================

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: string;
  notes?: string;
}

export interface DashboardAnalytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  ordersToday: number;
  revenueToday: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByDay: { date: string; revenue: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}

// ============================================
// PRODUCT/INVENTORY TYPES
// ============================================




export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
 // category: ProductCategory;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  //status: ProductStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// USER/AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
