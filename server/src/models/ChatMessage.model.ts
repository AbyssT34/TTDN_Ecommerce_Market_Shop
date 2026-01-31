import mongoose, { Schema, Document } from 'mongoose';

export interface IChatContextDoc {
  cartItems?: Array<{
    productId: string;
    name: string;
    quantity: number;
  }>;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'tired' | 'hurry';
  intent?: string;
}

export interface IChatMessageDoc extends Document {
  sessionId: string;
  user?: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  context?: IChatContextDoc;
  createdAt: Date;
}

const ChatContextSchema = new Schema<IChatContextDoc>(
  {
    cartItems: [{
      productId: String,
      name: String,
      quantity: Number,
    }],
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'tired', 'hurry'],
    },
    intent: String,
  },
  { _id: false }
);

const ChatMessageSchema = new Schema<IChatMessageDoc>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [10000, 'Message content cannot exceed 10000 characters'],
    },
    context: ChatContextSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes
ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });
ChatMessageSchema.index({ user: 1 });

// TTL index - auto delete messages after 30 days
ChatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const ChatMessage = mongoose.model<IChatMessageDoc>('ChatMessage', ChatMessageSchema);
