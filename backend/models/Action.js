import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['correttiva', 'preventiva', 'miglioramento'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  deadline: {
    type: Date,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['NonConformity', 'Audit', 'Risk', null],
    default: null
  },
  attachments: [{
    name: String,
    path: String,
    size: Number,
    uploadedAt: Date
  }],
  comments: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedDate: Date,
  effectiveness: {
    verified: Boolean,
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verifiedDate: Date,
    notes: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
actionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Action', actionSchema);
