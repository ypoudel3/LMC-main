export const errorHandler= (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack || err);
  res.status(500).json(
    { success: false, message: "Internal Server Error", error: err.message });
};