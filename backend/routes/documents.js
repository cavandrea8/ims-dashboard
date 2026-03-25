import express from 'express';
import Document from '../models/Document.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/documents
// @desc    Get all documents with filters
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
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const documents = await Document.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Document.countDocuments(query);
    
    res.json({
      documents,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/:id
// @desc    Get single document
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Documento non trovato' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/documents
// @desc    Create new document with file upload
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { code, title, type, iso, revision, owner, status, description, keywords } = req.body;
    
    // Check if code already exists
    const existing = await Document.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Codice documento già esistente' });
    }
    
    const documentData = {
      code,
      title,
      type,
      iso,
      revision: revision || '1.0',
      owner,
      status: status || 'draft',
      description,
      keywords: keywords ? (typeof keywords === 'string' ? keywords.split(',') : keywords) : [],
      createdBy: req.user._id
    };
    
    // Add file info if uploaded
    if (req.file) {
      documentData.file = {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    
    const document = await Document.create(documentData);
    
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document
// @access  Private
router.put('/:id', protect, upload.single('file'), async (req, res) => {
  try {
    const { code, title, type, iso, revision, owner, status, description, keywords } = req.body;
    
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Documento non trovato' });
    }
    
    // Check if new code already exists (if code is being changed)
    if (code && code !== document.code) {
      const existing = await Document.findOne({ code });
      if (existing) {
        return res.status(400).json({ message: 'Codice documento già esistente' });
      }
    }
    
    // Update fields
    if (code) document.code = code;
    if (title) document.title = title;
    if (type) document.type = type;
    if (iso) document.iso = iso;
    if (revision) document.revision = revision;
    if (owner) document.owner = owner;
    if (status) document.status = status;
    if (description !== undefined) document.description = description;
    if (keywords) {
      document.keywords = typeof keywords === 'string' ? keywords.split(',') : keywords;
    }
    
    // Add file info if new file uploaded
    if (req.file) {
      // Add old file to history
      if (document.file) {
        document.history.push({
          revision: document.revision,
          date: new Date(),
          changedBy: req.user.name,
          description: `Aggiornato file: ${document.file.name}`
        });
      }
      
      document.file = {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    
    document.updatedBy = req.user._id;
    
    document = await document.save();
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Documento non trovato' });
    }
    
    await document.deleteOne();
    
    res.json({ message: 'Documento eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/stats/summary
// @desc    Get documents statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Document.countDocuments();
    const byStatus = await Document.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byIso = await Document.aggregate([
      { $group: { _id: '$iso', count: { $sum: 1 } } }
    ]);
    const byType = await Document.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total,
      byStatus,
      byIso,
      byType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
