import User from "../models/User.js";

export const sendSOS = async (req, res) => {
  try {
    const { message, location } = req.body;
    const user = await User.findById(req.userId);

    console.log("🚨 SOS Alert Received:", {
      message,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      location,
    });

    res.json({ status: "SOS sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
