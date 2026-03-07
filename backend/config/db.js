import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        writeConcern: { w: "majority" },
      });
      console.log("✅ MongoDB Atlas Connected Successfully");
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection failed (Attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return connect();
      } else {
        console.error("--------------------------------------------------");
        console.error("⚠️ ACTION REQUIRED: MongoDB connection failed after multiple attempts.");
        console.error("--------------------------------------------------");
        console.error("1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas");
        console.error("2. Click on 'Network Access' in the left sidebar");
        console.error("3. Click 'ADD IP ADDRESS' and add 0.0.0.0/0 to allow all IPs (for development)");
        console.error("4. Make sure credentials in .env are correct:");
        console.error(`   MONGO_URI: ${process.env.MONGO_URI.replace(/:[^@]+@/, ':****@')}`);
        console.error("--------------------------------------------------");
        console.error("Your backend is still running. Database operations will fail until connection is established.");
        return false;
      }
    }
  };
  
  return connect();
};

export default connectDB;
