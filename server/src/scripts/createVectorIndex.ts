/**
 * MongoDB Atlas Vector Search Index Setup
 *
 * Run this script to create vector search indexes for AI features.
 * Requires MongoDB Atlas M10+ cluster with Vector Search enabled.
 *
 * Usage: npx tsx src/scripts/createVectorIndex.ts
 */

import mongoose from 'mongoose';
import { config } from '../config/index.js';

const VECTOR_DIMENSION = 1024; // Claude embedding dimension

const productVectorIndex = {
  name: 'product_vector_index',
  type: 'vectorSearch',
  definition: {
    fields: [
      {
        type: 'vector',
        path: 'embedding',
        numDimensions: VECTOR_DIMENSION,
        similarity: 'cosine',
      },
      {
        type: 'filter',
        path: 'isActive',
      },
      {
        type: 'filter',
        path: 'category',
      },
    ],
  },
};

const recipeVectorIndex = {
  name: 'recipe_vector_index',
  type: 'vectorSearch',
  definition: {
    fields: [
      {
        type: 'vector',
        path: 'embedding',
        numDimensions: VECTOR_DIMENSION,
        similarity: 'cosine',
      },
      {
        type: 'filter',
        path: 'isActive',
      },
      {
        type: 'filter',
        path: 'difficulty',
      },
    ],
  },
};

async function createVectorIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Create Product Vector Index
    console.log('\nCreating Product Vector Search Index...');
    try {
      await db.collection('products').createSearchIndex(productVectorIndex);
      console.log('Product vector index created successfully');
    } catch (error: unknown) {
      const err = error as { codeName?: string };
      if (err.codeName === 'IndexAlreadyExists') {
        console.log('Product vector index already exists');
      } else {
        throw error;
      }
    }

    // Create Recipe Vector Index
    console.log('\nCreating Recipe Vector Search Index...');
    try {
      await db.collection('recipes').createSearchIndex(recipeVectorIndex);
      console.log('Recipe vector index created successfully');
    } catch (error: unknown) {
      const err = error as { codeName?: string };
      if (err.codeName === 'IndexAlreadyExists') {
        console.log('Recipe vector index already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Vector indexes setup complete!');
    console.log(`
Note: Vector search indexes may take a few minutes to build.
Check your Atlas dashboard for index status.

Index Configuration:
- Dimension: ${VECTOR_DIMENSION} (Claude embedding)
- Similarity: cosine
- Collections: products, recipes
    `);

  } catch (error) {
    console.error('Error creating vector indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
createVectorIndexes();
