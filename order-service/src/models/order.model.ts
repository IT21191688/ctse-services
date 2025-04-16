import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem, OrderStatus } from "../types/order.types";

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.NEW,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    receipt_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate prices before saving
OrderSchema.pre("save", function (next) {
  if (this.isModified("orderItems")) {
    // Calculate items price
    this.itemsPrice = this.orderItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // Calculate tax (e.g., 15%)
    this.taxPrice = Number((this.itemsPrice * 0.15).toFixed(2));

    // Calculate total
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  }

  next();
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
