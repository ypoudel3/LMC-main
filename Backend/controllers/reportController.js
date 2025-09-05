import Report from "../models/Report.js";
import Category from "../models/Category.js";
import crypto from "crypto";
import { validationResult } from "express-validator";

// Generate anonymous ID
const generateAnonymousId = () => {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha256').update(`${timestamp}-${randomBytes}`).digest('hex');
  return hash.substring(0, 16).toUpperCase();
};

// Hash IP address for privacy
const hashIP = (ip) => crypto.createHash('sha256').update(ip).digest('hex');

// Submit new report
export const submitReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      category,
      severity,
      employerName,
      companyName,
      employerAddress,
      employerPhone,
      employerEmail,
      incidentDate,
      description,
      location,
      contactMethod,
      contactInfo,
      tags
    } = req.body;

    const anonymousId = generateAnonymousId();

    const report = new Report({
      anonymousId,
      category,
      severity,
      employerName,
      companyName,
      employerAddress,
      employerPhone,
      employerEmail,
      incidentDate: new Date(incidentDate),
      description,
      location,
      contactMethod: contactMethod || 'none',
      contactInfo,
      tags: tags || [],
      ipAddressHash: hashIP(req.ip),
      userAgent: req.get('User-Agent'),
      priority: severity === 'critical' ? 5 : severity === 'high' ? 4 : severity === 'medium' ? 3 : 2
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        anonymousId,
        status: 'pending',
        submittedAt: report.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get report status
export const getReportStatus = async (req, res) => {
  try {
    const { anonymousId } = req.params;

    if (!anonymousId || anonymousId.length !== 16) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tracking ID format'
      });
    }

    const report = await Report.findOne({ anonymousId }).select(
      'anonymousId status submittedAt lastUpdated category severity resolution'
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found with the provided tracking ID'
      });
    }

    res.json({
      success: true,
      data: {
        anonymousId: report.anonymousId,
        status: report.status,
        category: report.category,
        severity: report.severity,
        submittedAt: report.submittedAt,
        lastUpdated: report.lastUpdated,
        daysSinceSubmission: report.daysSinceSubmission,
        resolution: report.resolution
      }
    });

  } catch (error) {
    console.error('Error getting report status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get public stats
export const getPublicStats = async (req, res) => {
  try {
    const stats = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          resolvedReports: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          criticalReports: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const locationStats = await Report.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { totalReports: 0, resolvedReports: 0, criticalReports: 0 },
        byCategory: categoryStats,
        byLocation: locationStats
      }
    });

  } catch (error) {
    console.error('Error getting public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('-createdAt -updatedAt');

    res.json({ success: true, data: categories });

  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
