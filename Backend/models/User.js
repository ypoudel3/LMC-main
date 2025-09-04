import mongoose from "mongoose";

// Schema & Model
const sosSchema = new mongoose.Schema({
  username: { type: String, required: true },
email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create model
const User = mongoose.model("User", sosSchema);

// Export as default
export default User;
