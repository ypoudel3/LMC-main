import mongoose from "mongoose";

const connectDB = async () => {
  try {
 mongoose.connect("mongodb+srv://yunishapoudel6_db_user:yunisha%40123@cluster0.wkypn7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
