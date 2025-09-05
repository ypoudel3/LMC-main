import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect to MongoDB (v4+)
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // optional timeout
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
