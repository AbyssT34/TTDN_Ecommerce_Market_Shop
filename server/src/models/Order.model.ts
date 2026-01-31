import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItemDoc {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrderAddressDoc {
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
}

export interface IOrderStatusHistoryDoc {
  status: string;
  note?: string;
  createdAt: Date;
}

export interface IOrderDoc extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItemDoc[];
  shippingAddress: IOrderAddressDoc;
  paymentMethod: 'cod' | 'sepay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  note?: string;
  sepayTransactionId?: string;
  statusHistory: IOrderStatusHistoryDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDoc>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const OrderAddressSchema = new Schema<IOrderAddressDoc>(
  {
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, required: true },
  },
  { _id: false }
);

const OrderStatusHistorySchema = new Schema<IOrderStatusHistoryDoc>(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItemDoc[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: OrderAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'sepay'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    sepayTransactionId: {
      type: String,
    },
    statusHistory: [OrderStatusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save: Add initial status to history
OrderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      note: 'Order created',
      createdAt: new Date(),
    });
  }
  next();
});

// Static method to generate order number
OrderSchema.statics.generateOrderNumber = async function (): Promise<string> {
  const date = new Date();
  const prefix = `DH${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
};

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ paymentMethod: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ sepayTransactionId: 1 });

export const Order = mongoose.model<IOrderDoc>('Order', OrderSchema);
