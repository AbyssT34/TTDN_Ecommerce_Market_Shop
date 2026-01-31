import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeIngredientDoc {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  isOptional: boolean;
}

export interface IRecipeStepDoc {
  order: number;
  instruction: string;
  image?: string;
  duration?: number;
}

export interface IRecipeDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  video?: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: IRecipeIngredientDoc[];
  steps: IRecipeStepDoc[];
  tags: string[];
  isActive: boolean;
  embedding?: number[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeIngredientSchema = new Schema<IRecipeIngredientDoc>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const RecipeStepSchema = new Schema<IRecipeStepDoc>(
  {
    order: {
      type: Number,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
      maxlength: [1000, 'Instruction cannot exceed 1000 characters'],
    },
    image: {
      type: String,
    },
    duration: {
      type: Number,
    },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipeDoc>(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
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
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    video: {
      type: String,
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    ingredients: [RecipeIngredientSchema],
    steps: [RecipeStepSchema],
    tags: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    embedding: {
      type: [Number],
      select: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RecipeSchema.index({ slug: 1 });
RecipeSchema.index({ isActive: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ tags: 1 });
RecipeSchema.index({ 'ingredients.product': 1 });
RecipeSchema.index({ name: 'text', description: 'text', tags: 'text' });
RecipeSchema.index({ cookTime: 1, prepTime: 1 });

// Virtual for total time
RecipeSchema.virtual('totalTime').get(function () {
  return this.cookTime + this.prepTime;
});

export const Recipe = mongoose.model<IRecipeDoc>('Recipe', RecipeSchema);
