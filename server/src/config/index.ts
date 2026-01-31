import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  // MongoDB
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_shop',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // SePay
  sepay: {
    apiKey: process.env.SEPAY_API_KEY || '',
    accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || '',
    bankName: process.env.SEPAY_BANK_NAME || '',
    webhookSecret: process.env.SEPAY_WEBHOOK_SECRET || '',
  },

  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',

  // CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
