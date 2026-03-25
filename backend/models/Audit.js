import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
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
    enum: ['interno', 'esterno', 'fornitore', 'certificazione'],
    required: true
  },
  iso: {
    type: String,
    enum: ['9001', '14001', '45001', 'Tutti'],
    required: true
  },
  auditor: {
    type: String,
    required: true
  },
  auditTeam: [String],
  status: {
    type: String,
    enum: ['planned', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  departments: [String],
  scope: {
    type: String,
    default: ''
  },
  criteria: {
    type: String,
    default: ''
  },
  findings: [{
    type: {
      type: String,
      enum: ['opportunity', 'observation', 'minor_nc', 'major_nc']
    },
    description: String,
    clause: String,
    area: String,
    correctiveAction: {
      required: Boolean,
      action: String,
      responsible: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['open', 'in_progress', 'closed']
      }
    }
  }],
  conclusion: {
    type: String,
    default: ''
  },
  report: {
    name: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  attachments: [{
    name: String,
    path: String,
    size: Number,
    uploadedAt: Date
  }],
  participants: [{
    name: String,
    role: String,
    department: String
  }],
  checklist: [{
    question: String,
    clause: String,
    answer: {
      type: String,
      enum: ['yes', 'no', 'na']
    },
    notes: String
  }],
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
auditSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Audit', auditSchema);
