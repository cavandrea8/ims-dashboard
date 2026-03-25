import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database connection
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import ncRoutes from './routes/nonconformities.js';
import actionRoutes from './routes/actions.js';
import auditRoutes from './routes/audits.js';
import trainingRoutes from './routes/training.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/nonconformities', ncRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/training', trainingRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'IMS Dashboard API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File troppo grande. Dimensione massima: 10MB' 
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Errore del server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Rotta non trovata' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 IMS Dashboard Backend                                ║
║                                                           ║
║   Server attivo su http://localhost:${PORT}                 ║
║   API disponibili su http://localhost:${PORT}/api           ║
║                                                           ║
║   Database: Connesso                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
