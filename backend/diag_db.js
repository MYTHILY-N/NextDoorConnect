import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    console.log('Testing connection to:', process.env.MONGO_URI.replace(/:[^@]+@/, ':****@'));
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Success: Able to connect to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed: Unable to connect to MongoDB');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.message.includes('whitelist')) {
            console.error('Recommendation: Your IP is likely not whitelisted in MongoDB Atlas.');
        }
        process.exit(1);
    }
};

testConnection();
