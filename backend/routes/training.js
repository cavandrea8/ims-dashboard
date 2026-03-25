import express from 'express';
import Training from '../models/Training.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/training
// @desc    Get all training records with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { course: { $regex: search, $options: 'i' } },
        { trainer: { $regex: search, $options: 'i' } }
      ];
    }
    
    const trainings = await Training.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Training.countDocuments(query);
    
    res.json({
      trainings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/training/:id
// @desc    Get single training record
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!training) {
      return res.status(404).json({ message: 'Registro formazione non trovato' });
    }
    
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/training
// @desc    Create new training record
// @access  Private
router.post('/', protect, upload.array('materials', 10), async (req, res) => {
  try {
    const { 
      course, description, type, participants, date, duration, 
      trainer, trainerType, location, notes 
    } = req.body;
    
    const trainingData = {
      course,
      description: description || '',
      type,
      participants: parseInt(participants) || 0,
      date: new Date(date),
      duration: duration ? JSON.parse(duration) : { hours: 0, minutes: 0 },
      trainer,
      trainerType: trainerType || 'interno',
      location: location || '',
      notes: notes || '',
      createdBy: req.user._id
    };
    
    // Add materials if uploaded
    if (req.files && req.files.length > 0) {
      trainingData.materials = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
    }
    
    const training = await Training.create(trainingData);
    
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/training/:id
// @desc    Update training record
// @access  Private
router.put('/:id', protect, upload.array('materials', 10), async (req, res) => {
  try {
    const { 
      course, description, type, participants, date, duration, 
      trainer, trainerType, location, status, notes, participantsList,
      evaluation, certificates
    } = req.body;
    
    let training = await Training.findById(req.params.id);
    
    if (!training) {
      return res.status(404).json({ message: 'Registro formazione non trovato' });
    }
    
    // Update fields
    if (course) training.course = course;
    if (description !== undefined) training.description = description;
    if (type) training.type = type;
    if (participants !== undefined) training.participants = parseInt(participants);
    if (date) training.date = new Date(date);
    if (duration) training.duration = typeof duration === 'string' ? JSON.parse(duration) : duration;
    if (trainer) training.trainer = trainer;
    if (trainerType) training.trainerType = trainerType;
    if (location !== undefined) training.location = location;
    if (status) training.status = status;
    if (notes !== undefined) training.notes = notes;
    if (participantsList) training.participantsList = typeof participantsList === 'string' ? JSON.parse(participantsList) : participantsList;
    if (evaluation) training.evaluation = typeof evaluation === 'string' ? JSON.parse(evaluation) : evaluation;
    if (certificates) training.certificates = typeof certificates === 'string' ? JSON.parse(certificates) : certificates;
    
    // Add new materials if uploaded
    if (req.files && req.files.length > 0) {
      const newMaterials = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        size: file.size,
        uploadedAt: new Date()
      }));
      training.materials = [...(training.materials || []), ...newMaterials];
    }
    
    training.updatedBy = req.user._id;
    
    training = await training.save();
    
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/training/:id
// @desc    Delete training record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    
    if (!training) {
      return res.status(404).json({ message: 'Registro formazione non trovato' });
    }
    
    await training.deleteOne();
    
    res.json({ message: 'Registro formazione eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/training/stats/summary
// @desc    Get training statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Training.countDocuments();
    const byStatus = await Training.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byType = await Training.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Total participants
    const totalParticipants = await Training.aggregate([
      { $group: { _id: null, total: { $sum: '$participants' } } }
    ]);
    
    // Total hours (completed trainings)
    const totalHours = await Training.aggregate([
      { $match: { status: 'completed' } },
      { $group: { 
          _id: null, 
          hours: { $sum: { $add: [
            { $ifNull: ['$duration.hours', 0] },
            { $divide: [{ $ifNull: ['$duration.minutes', 0] }, 60] }
          ]} }
        } 
      }
    ]);
    
    res.json({
      total,
      byStatus,
      byType,
      totalParticipants: totalParticipants[0]?.total || 0,
      totalHours: Math.round(totalHours[0]?.hours || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
