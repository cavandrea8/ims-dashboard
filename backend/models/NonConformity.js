import mongoose from 'mongoose';

const nonConformitySchema = new mongoose.Schema({
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
    required: true
  },
  iso: {
    type: String,
    enum: ['9001', '14001', '45001'],
    required: true
  },
  severity: {
    type: String,
    enum: ['minor', 'major', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'closed', 'cancelled'],
    default: 'open'
  },
  date: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    enum: ['audit', 'inspection', 'complaint', 'incident', 'other'],
    default: 'other'
  },
  rootCause: {
    type: String,
    default: ''
  },
  correctiveActions: [{
    action: String,
    responsible: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  attachments: [{
    name: String,
    path: String,
    size: Number,
    uploadedAt: Date
  }],
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  closedDate: Date,
  closedReason: String,
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
nonConformitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('NonConformity', nonConformitySchema);
