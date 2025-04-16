import { Document, ObjectId } from "mongoose";

export enum OrderStatus {
  NEW = "new",
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
  APPROVED = "approved",
}

export interface IOrderItem {
  product: ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface IOrder extends Document {
  orderId: string;
  user: ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: OrderStatus;
  deliveredAt?: Date;
  notes?: string;
  receipt_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderInput {
  userId: string;
  orderItems: {
    product: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
}

export interface IStripeSession {
  id: string;
  payment_status: string;
  customer_email: string;
  shipping_cost: {
    amount_total: number;
  };
  amount_total: number;
  metadata: {
    order_id: string;
    orderId: string;
  };
  payment_intent: string;
  payment_method_types: string[];
  customer_details: {
    address: {
      line1: string;
      city: string;
      country: string;
      postal_code: string;
    };
  };
}

export interface IOrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
}

export enum ROLES {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}
