/**
 * Seed Database with Sample Data
 *
 * Usage: npx tsx src/scripts/seedDatabase.ts
 */

import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User } from '../models/User.model.js';
import { Category } from '../models/Category.model.js';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Create Admin User
    console.log('\nCreating admin user...');
    const adminExists = await User.findOne({ email: 'admin@ecommerce.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@ecommerce.com',
        password: 'admin123456',
        name: 'Admin User',
        role: 'superadmin',
        isActive: true,
      });
      console.log('Admin user created: admin@ecommerce.com / admin123456');
    } else {
      console.log('Admin user already exists');
    }

    // Create Categories
    console.log('\nCreating categories...');
    const categories = [
      { name: 'Thịt & Hải sản', slug: 'thit-hai-san', order: 1 },
      { name: 'Rau củ quả', slug: 'rau-cu-qua', order: 2 },
      { name: 'Gia vị & Nước chấm', slug: 'gia-vi-nuoc-cham', order: 3 },
      { name: 'Đồ khô & Ngũ cốc', slug: 'do-kho-ngu-coc', order: 4 },
      { name: 'Sữa & Trứng', slug: 'sua-trung', order: 5 },
      { name: 'Đồ uống', slug: 'do-uong', order: 6 },
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      }
    }

    console.log('\n✅ Database seeding complete!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
