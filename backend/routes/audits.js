import express from 'express';
import Audit from '../models/Audit.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/audits
// @desc    Get all audits with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { iso, type, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (iso && iso !== 'all') query.iso = iso;
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { auditor: { $regex: search, $options: 'i' } }
      ];
    }
    
    const audits = await Audit.find(query)
      .populate('createdBy', 'name email')
      .sort({ startDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Audit.countDocuments(query);
    
    res.json({
      audits,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/audits/:id
// @desc    Get single audit
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit non trovato' });
    }
    
    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/audits
// @desc    Create new audit
// @access  Private
router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { 
      code, title, description, type, iso, auditor, startDate, endDate, 
      departments, scope, criteria, auditTeam 
    } = req.body;
    
    // Check if code already exists
    const existing = await Audit.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Codice audit già esistente' });
    }
    
    const auditData = {
      code,
      title,
      description: description || '',
      type,
      iso,
      auditor,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      departments: departments ? (typeof departments === 'string' ? departments.split(',') : departments) : [],
      scope: scope || '',
      criteria: criteria || '',
      auditTeam: auditTeam ? (typeof auditTeam === 'string' ? auditTeam.split(',') : auditTeam) : [],
      createdBy: req.user._id
    };
    
    // Add attachments if uploaded
    if (req.files && req.files.length > 0) {
      auditData.attachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
    }
    
    const audit = await Audit.create(auditData);
    
    res.status(201).json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/audits/:id
// @desc    Update audit
// @access  Private
router.put('/:id', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { 
      title, description, type, iso, auditor, startDate, endDate, 
      status, departments, scope, conclusion, findings 
    } = req.body;
    
    let audit = await Audit.findById(req.params.id);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit non trovato' });
    }
    
    // Update fields
    if (title) audit.title = title;
    if (description !== undefined) audit.description = description;
    if (type) audit.type = type;
    if (iso) audit.iso = iso;
    if (auditor) audit.auditor = auditor;
    if (startDate) audit.startDate = new Date(startDate);
    if (endDate) audit.endDate = new Date(endDate);
    if (status) audit.status = status;
    if (departments) audit.departments = typeof departments === 'string' ? departments.split(',') : departments;
    if (scope !== undefined) audit.scope = scope;
    if (conclusion !== undefined) audit.conclusion = conclusion;
    if (findings) audit.findings = JSON.parse(findings);
    
    // Add new attachments if uploaded
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
      audit.attachments = [...(audit.attachments || []), ...newAttachments];
    }
    
    audit.updatedBy = req.user._id;
    
    audit = await audit.save();
    
    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/audits/:id
// @desc    Delete audit
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    
    if (!audit) {
      return res.status(404).json({ message: 'Audit non trovato' });
    }
    
    await audit.deleteOne();
    
    res.json({ message: 'Audit eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/audits/stats/summary
// @desc    Get audit statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Audit.countDocuments();
    const byStatus = await Audit.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byType = await Audit.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const byIso = await Audit.aggregate([
      { $group: { _id: '$iso', count: { $sum: 1 } } }
    ]);
    
    // Upcoming audits (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcoming = await Audit.countDocuments({
      status: { $in: ['planned', 'scheduled'] },
      startDate: { $lte: thirtyDaysFromNow }
    });
    
    res.json({
      total,
      byStatus,
      byType,
      byIso,
      upcoming
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
