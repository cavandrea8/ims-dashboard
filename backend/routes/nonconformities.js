import express from 'express';
import NonConformity from '../models/NonConformity.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/nonconformities
// @desc    Get all non-conformities with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { iso, severity, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (iso && iso !== 'all') query.iso = iso;
    if (severity && severity !== 'all') query.severity = severity;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const nonConformities = await NonConformity.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await NonConformity.countDocuments(query);
    
    res.json({
      nonConformities,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/nonconformities/:id
// @desc    Get single non-conformity
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const nc = await NonConformity.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('closedBy', 'name email');
    
    if (!nc) {
      return res.status(404).json({ message: 'Non conformità non trovata' });
    }
    
    res.json(nc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/nonconformities
// @desc    Create new non-conformity
// @access  Private
router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { code, title, description, iso, severity, owner, deadline, source, rootCause } = req.body;
    
    // Check if code already exists
    const existing = await NonConformity.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Codice NC già esistente' });
    }
    
    const ncData = {
      code,
      title,
      description,
      iso,
      severity,
      owner,
      deadline: new Date(deadline),
      source: source || 'other',
      rootCause: rootCause || '',
      createdBy: req.user._id
    };
    
    // Add attachments if uploaded
    if (req.files && req.files.length > 0) {
      ncData.attachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
    }
    
    const nc = await NonConformity.create(ncData);
    
    res.status(201).json(nc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/nonconformities/:id
// @desc    Update non-conformity
// @access  Private
router.put('/:id', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, iso, severity, status, owner, deadline, rootCause, correctiveActions } = req.body;
    
    let nc = await NonConformity.findById(req.params.id);
    
    if (!nc) {
      return res.status(404).json({ message: 'Non conformità non trovata' });
    }
    
    // Update fields
    if (title) nc.title = title;
    if (description) nc.description = description;
    if (iso) nc.iso = iso;
    if (severity) nc.severity = severity;
    if (status) {
      nc.status = status;
      if (status === 'closed') {
        nc.closedBy = req.user._id;
        nc.closedDate = new Date();
      }
    }
    if (owner) nc.owner = owner;
    if (deadline) nc.deadline = new Date(deadline);
    if (rootCause) nc.rootCause = rootCause;
    if (correctiveActions) nc.correctiveActions = JSON.parse(correctiveActions);
    
    // Add new attachments if uploaded
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
      nc.attachments = [...(nc.attachments || []), ...newAttachments];
    }
    
    nc.updatedBy = req.user._id;
    
    nc = await nc.save();
    
    res.json(nc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/nonconformities/:id
// @desc    Delete non-conformity
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const nc = await NonConformity.findById(req.params.id);
    
    if (!nc) {
      return res.status(404).json({ message: 'Non conformità non trovata' });
    }
    
    await nc.deleteOne();
    
    res.json({ message: 'Non conformità eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/nonconformities/stats/summary
// @desc    Get NC statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await NonConformity.countDocuments();
    const byStatus = await NonConformity.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const bySeverity = await NonConformity.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    const byIso = await NonConformity.aggregate([
      { $group: { _id: '$iso', count: { $sum: 1 } } }
    ]);
    
    // Open critical/major NCs
    const openCritical = await NonConformity.countDocuments({ 
      severity: 'critical', 
      status: { $in: ['open', 'in_progress'] } 
    });
    
    res.json({
      total,
      byStatus,
      bySeverity,
      byIso,
      openCritical
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
