import mongoose, { Schema, Document } from 'mongoose';

export interface INutritionInfoDoc {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface IProductDoc extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  tags: string[];
  stockQuantity: number;
  unit: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  nutritionInfo?: INutritionInfoDoc;
  embedding?: number[];
  viewCount: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionInfoSchema = new Schema<INutritionInfoDoc>(
  {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    fiber: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDoc>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    stockQuantity: {
      type: Number,
      required: true,
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      default: 'kg',
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    nutritionInfo: NutritionInfoSchema,
    embedding: {
      type: [Number],
      select: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stockQuantity: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Vector search index (created via Atlas UI or migration script)
// Index name: product_vector_index
// Field: embedding (dimensions: 1536 for OpenAI, 1024 for Claude)

export const Product = mongoose.model<IProductDoc>('Product', ProductSchema);
