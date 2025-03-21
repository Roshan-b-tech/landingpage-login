import mongoose from 'mongoose';

// MongoDB connection string - replace with your actual MongoDB URI in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/popxapp';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB; 