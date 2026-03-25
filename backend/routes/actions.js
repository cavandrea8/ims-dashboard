import express from 'express';
import Action from '../models/Action.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/actions
// @desc    Get all actions with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, priority, status, owner, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (type && type !== 'all') query.type = type;
    if (priority && priority !== 'all') query.priority = priority;
    if (status && status !== 'all') query.status = status;
    if (owner) query.owner = { $regex: owner, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const actions = await Action.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Action.countDocuments(query);
    
    res.json({
      actions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/actions/:id
// @desc    Get single action
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const action = await Action.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('comments.author', 'name email');
    
    if (!action) {
      return res.status(404).json({ message: 'Azione non trovata' });
    }
    
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/actions
// @desc    Create new action
// @access  Private
router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { code, title, description, type, priority, deadline, owner, relatedTo, relatedModel } = req.body;
    
    // Check if code already exists
    const existing = await Action.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Codice azione già esistente' });
    }
    
    const actionData = {
      code,
      title,
      description: description || '',
      type,
      priority,
      deadline: new Date(deadline),
      owner,
      createdBy: req.user._id
    };
    
    if (relatedTo) actionData.relatedTo = relatedTo;
    if (relatedModel) actionData.relatedModel = relatedModel;
    
    // Add attachments if uploaded
    if (req.files && req.files.length > 0) {
      actionData.attachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
    }
    
    const action = await Action.create(actionData);
    
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/actions/:id
// @desc    Update action
// @access  Private
router.put('/:id', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, type, priority, status, progress, deadline, owner } = req.body;
    
    let action = await Action.findById(req.params.id);
    
    if (!action) {
      return res.status(404).json({ message: 'Azione non trovata' });
    }
    
    // Update fields
    if (title) action.title = title;
    if (description !== undefined) action.description = description;
    if (type) action.type = type;
    if (priority) action.priority = priority;
    if (status) {
      action.status = status;
      if (status === 'completed') {
        action.completedBy = req.user._id;
        action.completedDate = new Date();
      }
    }
    if (progress !== undefined) action.progress = parseInt(progress);
    if (deadline) action.deadline = new Date(deadline);
    if (owner) action.owner = owner;
    
    // Add new attachments if uploaded
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
      action.attachments = [...(action.attachments || []), ...newAttachments];
    }
    
    action.updatedBy = req.user._id;
    
    action = await action.save();
    
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/actions/:id/comments
// @desc    Add comment to action
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    const action = await Action.findById(req.params.id);
    
    if (!action) {
      return res.status(404).json({ message: 'Azione non trovata' });
    }
    
    action.comments.push({
      text,
      author: req.user._id
    });
    
    await action.save();
    
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/actions/:id
// @desc    Delete action
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    
    if (!action) {
      return res.status(404).json({ message: 'Azione non trovata' });
    }
    
    await action.deleteOne();
    
    res.json({ message: 'Azione eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/actions/stats/summary
// @desc    Get action statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Action.countDocuments();
    const byStatus = await Action.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byPriority = await Action.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const byType = await Action.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Overdue actions
    const overdue = await Action.countDocuments({
      status: { $in: ['open', 'in_progress'] },
      deadline: { $lt: new Date() }
    });
    
    res.json({
      total,
      byStatus,
      byPriority,
      byType,
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
