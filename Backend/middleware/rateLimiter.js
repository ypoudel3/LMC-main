
// Rate limit for report submission
const reportSubmission = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 reports per window
  message: {
    success: false,
    message: 'Too many reports submitted. Please wait before submitting another report.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for status checking
const statusCheck = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 status checks per minute
  message: {
    success: false,
    message: 'Too many status check requests. Please wait before trying again.'
  }
});

// General rate limit
const general = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  }
});

export default module.exports = {
  reportSubmission,
  statusCheck,
  general
};