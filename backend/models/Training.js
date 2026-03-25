import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['sicurezza', 'qualita', 'ambiente', 'tecnica', 'generale'],
    required: true
  },
  participants: {
    type: Number,
    default: 0
  },
  participantsList: [{
    name: String,
    department: String,
    signature: String,
    signedAt: Date
  }],
  date: {
    type: Date,
    required: true
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  trainer: {
    type: String,
    required: true
  },
  trainerType: {
    type: String,
    enum: ['interno', 'esterno'],
    default: 'interno'
  },
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['planned', 'scheduled', 'completed', 'cancelled'],
    default: 'planned'
  },
  materials: [{
    name: String,
    path: String,
    size: Number,
    uploadedAt: Date
  }],
  attendance: {
    sheet: {
      name: String,
      path: String,
      size: Number,
      uploadedAt: Date
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  evaluation: {
    test: Boolean,
    averageScore: Number,
    feedback: String
  },
  certificates: [{
    participant: String,
    certificateNumber: String,
    issuedAt: Date,
    validUntil: Date,
    path: String
  }],
  cost: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  notes: {
    type: String,
    default: ''
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
trainingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Training', trainingSchema);
