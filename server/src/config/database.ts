import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 */
export const connectDatabase = async (): Promise<void> => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not set. Running in offline mode.');
        console.warn('   Set MONGODB_URI in server/.env to enable database.');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            // Connection options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ Connected to MongoDB Atlas');

        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        // Don't exit - allow running without DB for development
        console.warn('   Server will run in offline mode.');
    }
};

export default mongoose;
