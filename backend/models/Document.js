import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Manuale', 'Procedura', 'Istruzione', 'Registro', 'Modulo'],
    required: true
  },
  iso: {
    type: String,
    enum: ['9001', '14001', '45001', 'Tutti'],
    required: true
  },
  revision: {
    type: String,
    default: '1.0'
  },
  date: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['approved', 'active', 'review', 'draft', 'archived'],
    default: 'draft'
  },
  file: {
    name: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  description: {
    type: String,
    default: ''
  },
  keywords: [String],
  history: [{
    revision: String,
    date: Date,
    changedBy: String,
    description: String
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
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Document', documentSchema);
