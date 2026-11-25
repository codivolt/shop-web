export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  passwordSetAt?: string | null;
  referralCode: string | null;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface BrandRef {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  parent?: CategoryRef | null;
  children?: CategoryRef[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  imageUrl: string | null;
  isActive: boolean;
  category?: Category;
  brand?: Brand | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductAttributeValue {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
  attribute?: {
    id: string;
    name: string;
    type: string;
    options: string | null;
    isRequired: boolean;
    sortOrder: number;
  };
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartLineProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: CartLineProduct;
  quantity: number;
  totalPrice: number;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  price: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentAccountType =
  | "card_to_card"
  | "sheba"
  | "cash_on_delivery"
  | "crypto";

export interface PaymentAccount {
  id: string;
  name: string;
  type: PaymentAccountType;
  bankName: string | null;
  accountHolder: string | null;
  cardNumber: string | null;
  sheba: string | null;
  cryptoAddress: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string | null;
  recipientName: string | null;
  phone: string | null;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  deliveryMethodId: string | null;
  deliveryPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  receiptImageUrl: string | null;
  rejectionReason: string | null;
  receiptDeadline: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
