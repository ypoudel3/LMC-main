import User from "../models/User.js";

export const sendSOS = async (req, res) => {
  try {
    const { message, location } = req.body;

    // req.user is already fetched in auth middleware
    if (!req.user) return res.status(401).json({ error: "User not authenticated" });

    console.log("🚨 SOS Alert Received:", {
      message,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
      location,
    });

    res.json({ status: "SOS sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

