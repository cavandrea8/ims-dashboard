import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Line
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle, FileText, Shield, 
  Leaf, BarChart2, Users, Calendar, Search, Bell, Menu, X,
  ChevronRight, Download, Filter, MoreVertical, Plus, Edit, Trash2,
  Eye, Upload, Clock, TrendingUp, TrendingDown, AlertCircle,
  User, Settings, LogOut, MessageSquare,
  CheckSquare, ArrowRight, Zap, Target,
  Layers, PieChart as PieChartIcon, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import API
import { 
  authAPI, documentsAPI, nonConformitiesAPI, actionsAPI, 
  auditsAPI, trainingAPI, healthCheck 
} from './api.js';

// ==================== COMPONENTI UI ====================

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-green-100 text-green-700 border-green-200',
    active: 'bg-blue-100 text-blue-700 border-blue-200',
    review: 'bg-amber-100 text-amber-700 border-amber-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    open: 'bg-red-100 text-red-700 border-red-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    closed: 'bg-green-100 text-green-700 border-green-200',
    scheduled: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    planned: 'bg-slate-100 text-slate-700 border-slate-200',
    critical: 'bg-red-600 text-white border-red-700',
    major: 'bg-orange-100 text-orange-700 border-orange-200',
    minor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  const labels = {
    approved: 'Approvato', active: 'Attivo', review: 'In Revisione', draft: 'Bozza',
    open: 'Aperto', in_progress: 'In Corso', closed: 'Chiuso',
    scheduled: 'Programmato', completed: 'Completato', planned: 'Pianificato',
    critical: 'Critica', major: 'Maggiore', minor: 'Minore',
    high: 'Alta', medium: 'Media', low: 'Bassa',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  );
};

const ISOBadge = ({ iso }) => {
  const styles = {
    '9001': 'bg-blue-100 text-blue-700 border-blue-200',
    '14001': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '45001': 'bg-amber-100 text-amber-700 border-amber-200',
    'Tutti': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[iso] || styles['Tutti']}`}>
      ISO {iso}
    </span>
  );
};

const ProgressBar = ({ value, color = 'blue' }) => {
  const colors = { blue: 'bg-blue-600', green: 'bg-green-600', amber: 'bg-amber-600', red: 'bg-red-600' };
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className={`${colors[color]} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} className="text-slate-500" /></button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
    <div className="flex items-center space-x-3">
      <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">{badge}</span>}
  </button>
);

const StatCard = ({ title, value, subtitle, trend, trendValue, icon: Icon, color, onClick }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', trend: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', trend: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', trend: 'text-amber-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', trend: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', trend: 'text-purple-600' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600', trend: 'text-slate-600' },
  };
  const colorStyle = colors[color] || colors.slate;
  
  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgb(0 0 0 / 0.1)' }} onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorStyle.bg}`}><Icon size={24} className={colorStyle.icon} /></div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${colorStyle.trend}`}>
          {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : trend === 'down' ? <TrendingDown size={16} className="mr-1" /> : <Activity size={16} className="mr-1" />}
          <span>{trendValue}</span>
          <span className="text-slate-400 ml-1 font-normal">vs mese scorso</span>
        </div>
      )}
    </motion.div>
  );
};

// ==================== LOGIN COMPONENT ====================

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Login fallito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-emerald-600 to-amber-600 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 flex items-center justify-center">
            <Layers size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">IMS Pro</h1>
          <p className="text-slate-500">Sistema di Gestione Integrato</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@ims.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50">
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 font-medium mb-2">Credenziali demo:</p>
          <p className="text-xs text-slate-600">admin@ims.com / password123</p>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== MAIN APP ====================

const App = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [documents, setDocuments] = useState([]);
  const [nonConformities, setNonConformities] = useState([]);
  const [actions, setActions] = useState([]);
  const [audits, setAudits] = useState([]);
  const [training, setTraining] = useState([]);
  const [stats, setStats] = useState({});

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      const [docs, nc, acts, aud, train] = await Promise.all([
        documentsAPI.getAll(),
        nonConformitiesAPI.getAll(),
        actionsAPI.getAll(),
        auditsAPI.getAll(),
        trainingAPI.getAll(),
      ]);
      setDocuments(docs.documents || []);
      setNonConformities(nc.nonConformities || []);
      setActions(acts.actions || []);
      setAudits(audits.audits || []);
      setTraining(train.trainings || []);
      
      // Calculate stats
      setStats({
        ncOpen: (nc.nonConformities || []).filter(n => n.status === 'open').length,
        ncCritical: (nc.nonConformities || []).filter(n => n.severity === 'critical' && n.status !== 'closed').length,
        actionsInProgress: (acts.actions || []).filter(a => a.status === 'in_progress').length,
        documentsReview: (docs.documents || []).filter(d => d.status === 'review').length,
        auditsScheduled: (aud.audits || []).filter(a => a.status === 'scheduled').length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setModalOpen(true);
    setSelectedFile(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setSelectedFile(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formFormData.append(key, formData[key]);
      }
    });
    if (selectedFile) {
      formFormData.append('file', selectedFile);
    }

    try {
      if (modalType === 'document') {
        await documentsAPI.create(formFormData);
      } else if (modalType === 'nonconformity') {
        await nonConformitiesAPI.create(formFormData);
      } else if (modalType === 'action') {
        await actionsAPI.create(formFormData);
      } else if (modalType === 'audit') {
        await auditsAPI.create(formFormData);
      } else if (modalType === 'training') {
        await trainingAPI.create(formFormData);
      }
      closeModal();
      loadData();
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;
    
    try {
      if (type === 'document') await documentsAPI.delete(id);
      else if (type === 'nonconformity') await nonConformitiesAPI.delete(id);
      else if (type === 'action') await actionsAPI.delete(id);
      else if (type === 'audit') await auditsAPI.delete(id);
      else if (type === 'training') await trainingAPI.delete(id);
      loadData();
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  const navigateTo = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 flex items-center justify-center animate-pulse">
            <Layers size={32} className="text-white" />
          </div>
          <p className="text-slate-600 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={login} />;
  }

  // ==================== RENDER VIEWS ====================

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="NC Aperte" value={stats.ncOpen || 0} subtitle={`${stats.ncCritical || 0} critiche`} trend="down" trendValue={`-${stats.ncCritical || 0}`} icon={AlertTriangle} color="red" onClick={() => navigateTo('nonconformities')} />
        <StatCard title="Azioni in Corso" value={stats.actionsInProgress || 0} subtitle="4 in ritardo" trend="up" trendValue="+3" icon={CheckSquare} color="amber" onClick={() => navigateTo('actions')} />
        <StatCard title="Audit Programmati" value={stats.auditsScheduled || 0} subtitle="Prossimi 30 giorni" trend="stable" trendValue="0" icon={Calendar} color="purple" onClick={() => navigateTo('audits')} />
        <StatCard title="Documenti" value={documents.length} subtitle={`${stats.documentsReview || 0} in revisione`} trend="up" trendValue="+4" icon={FileText} color="blue" onClick={() => navigateTo('documents')} />
        <StatCard title="Ore Formazione" value={training.reduce((acc, t) => acc + (t.duration?.hours || 0), 0)} subtitle="Target: 500" trend="up" trendValue="+45" icon={Users} color="green" onClick={() => navigateTo('training')} />
        <StatCard title="Giorni Senza Infortuni" value="87" subtitle="Record aziendale" trend="up" trendValue="+7" icon={Shield} color="slate" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-lg font-bold mb-2">Azioni Rapide</h3>
          <p className="text-blue-200 text-sm mb-6">Accedi rapidamente alle funzioni principali</p>
          <div className="space-y-3">
            <button onClick={() => navigateTo('nonconformities')} className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <div className="p-2 bg-red-500/20 rounded-lg"><AlertTriangle size={18} /></div>
              <div className="flex-1 text-left"><p className="font-medium text-sm">Nuova Non Conformità</p><p className="text-xs text-blue-200">Registra una nuova NC</p></div>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigateTo('actions')} className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <div className="p-2 bg-green-500/20 rounded-lg"><CheckSquare size={18} /></div>
              <div className="flex-1 text-left"><p className="font-medium text-sm">Nuova Azione</p><p className="text-xs text-blue-200">Crea azione correttiva</p></div>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigateTo('documents')} className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <div className="p-2 bg-amber-500/20 rounded-lg"><Upload size={18} /></div>
              <div className="flex-1 text-left"><p className="font-medium text-sm">Carica Documento</p><p className="text-xs text-blue-200">Nuova versione</p></div>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigateTo('audits')} className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <div className="p-2 bg-purple-500/20 rounded-lg"><Calendar size={18} /></div>
              <div className="flex-1 text-left"><p className="font-medium text-sm">Programma Audit</p><p className="text-xs text-blue-200">Pianifica nuovo audit</p></div>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Attività Recenti</h3>
          <div className="space-y-4">
            {documents.slice(0, 3).map((doc, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="p-2.5 rounded-xl bg-blue-100"><FileText size={18} className="text-blue-600" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-slate-800">{doc.title}</p><p className="text-xs text-slate-500">{doc.code}</p></div>
              </div>
            ))}
            {nonConformities.slice(0, 2).map((nc, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="p-2.5 rounded-xl bg-red-100"><AlertTriangle size={18} className="text-red-600" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-slate-800">{nc.title}</p><p className="text-xs text-slate-500">{nc.code}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Gestione Documentale</h2><p className="text-slate-500">Archivio documenti del sistema integrato</p></div>
        <button onClick={() => openModal('document')} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"><Plus size={18} /><span>Nuovo Documento</span></button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Codice</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Titolo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">ISO</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Rev.</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Stato</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc._id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-mono text-sm text-blue-600">{doc.code}</td>
                <td className="py-4 px-6"><p className="font-medium">{doc.title}</p><p className="text-xs text-slate-500">{doc.owner}</p></td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-lg text-xs bg-slate-100">{doc.type}</span></td>
                <td className="py-4 px-6"><ISOBadge iso={doc.iso} /></td>
                <td className="py-4 px-6 text-sm">{doc.revision}</td>
                <td className="py-4 px-6"><StatusBadge status={doc.status} /></td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button onClick={() => handleDelete('document', doc._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNonConformities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Non Conformità</h2><p className="text-slate-500">Gestione e tracciamento NC</p></div>
        <button onClick={() => openModal('nonconformity')} className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"><Plus size={18} /><span>Nuova NC</span></button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Codice</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Titolo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">ISO</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Gravità</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Stato</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {nonConformities.map((nc) => (
              <tr key={nc._id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-mono text-sm text-red-600">{nc.code}</td>
                <td className="py-4 px-6"><p className="font-medium">{nc.title}</p><p className="text-xs text-slate-500">{nc.owner}</p></td>
                <td className="py-4 px-6"><ISOBadge iso={nc.iso} /></td>
                <td className="py-4 px-6"><StatusBadge status={nc.severity} /></td>
                <td className="py-4 px-6"><StatusBadge status={nc.status} /></td>
                <td className="py-4 px-6">
                  <button onClick={() => handleDelete('nonconformity', nc._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-600" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Azioni Correttive</h2><p className="text-slate-500">Piano azioni e monitoraggio</p></div>
        <button onClick={() => openModal('action')} className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700"><Plus size={18} /><span>Nuova Azione</span></button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {actions.map((action) => (
          <motion.div key={action._id} whileHover={{ y: -2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-green-100"><CheckSquare size={20} className="text-green-600" /></div>
                <div><p className="font-mono text-sm text-slate-500">{action.code}</p><h3 className="font-bold text-slate-800">{action.title}</h3></div>
              </div>
              <StatusBadge status={action.status} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Avanzamento</span><span className="font-medium">{action.progress}%</span></div>
              <ProgressBar value={action.progress} color={action.progress === 100 ? 'green' : 'blue'} />
              <div className="flex justify-between pt-3 border-t"><span className="text-sm text-slate-500">{action.owner}</span><StatusBadge status={action.priority} /></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Programma Audit</h2><p className="text-slate-500">Pianificazione audit</p></div>
        <button onClick={() => openModal('audit')} className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"><Plus size={18} /><span>Nuovo Audit</span></button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Codice</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Titolo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Auditor</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Data</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Stato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {audits.map((audit) => (
              <tr key={audit._id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-mono text-sm text-purple-600">{audit.code}</td>
                <td className="py-4 px-6 font-medium">{audit.title}</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-lg text-xs bg-slate-100">{audit.type}</span></td>
                <td className="py-4 px-6 text-sm">{audit.auditor}</td>
                <td className="py-4 px-6 text-sm">{new Date(audit.startDate).toLocaleDateString()}</td>
                <td className="py-4 px-6"><StatusBadge status={audit.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Formazione</h2><p className="text-slate-500">Registro corsi</p></div>
        <button onClick={() => openModal('training')} className="flex items-center space-x-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700"><Plus size={18} /><span>Nuovo Corso</span></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white">
          <Users size={32} className="opacity-80 mb-4" />
          <p className="text-4xl font-bold">{training.reduce((acc, t) => acc + (t.participants || 0), 0)}</p>
          <p className="text-amber-100 text-sm mt-2">Partecipanti totali</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <CheckCircle size={32} className="text-green-600 mb-4" />
          <p className="text-4xl font-bold text-slate-800">{training.filter(t => t.status === 'completed').length}</p>
          <p className="text-slate-500 text-sm mt-2">Corsi completati</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <Calendar size={32} className="text-purple-600 mb-4" />
          <p className="text-4xl font-bold text-slate-800">{training.filter(t => t.status === 'scheduled').length}</p>
          <p className="text-slate-500 text-sm mt-2">Corsi programmati</p>
        </div>
      </div>
    </div>
  );

  // ==================== MODAL FORMS ====================

  const renderModalForm = () => {
    switch (modalType) {
      case 'document':
        return (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Codice" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
              <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Tipo</option><option value="Manuale">Manuale</option><option value="Procedura">Procedura</option><option value="Istruzione">Istruzione</option><option value="Registro">Registro</option>
              </select>
            </div>
            <input type="text" placeholder="Titolo" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.iso || ''} onChange={e => setFormData({...formData, iso: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">ISO</option><option value="9001">9001</option><option value="14001">14001</option><option value="45001">45001</option><option value="Tutti">Tutti</option>
              </select>
              <input type="text" placeholder="Responsabile" value={formData.owner || ''} onChange={e => setFormData({...formData, owner: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
            </div>
            <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" />
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-slate-200">Annulla</button>
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-blue-600 text-white">Crea</button>
            </div>
          </form>
        );
      case 'nonconformity':
        return (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" placeholder="Codice" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <input type="text" placeholder="Titolo" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <textarea placeholder="Descrizione" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 h-24" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.iso || ''} onChange={e => setFormData({...formData, iso: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">ISO</option><option value="9001">9001</option><option value="14001">14001</option><option value="45001">45001</option>
              </select>
              <select value={formData.severity || ''} onChange={e => setFormData({...formData, severity: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Gravità</option><option value="minor">Minore</option><option value="major">Maggiore</option><option value="critical">Critica</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Responsabile" value={formData.owner || ''} onChange={e => setFormData({...formData, owner: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
              <input type="date" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-slate-200">Annulla</button>
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-red-600 text-white">Crea</button>
            </div>
          </form>
        );
      case 'action':
        return (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" placeholder="Codice" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <input type="text" placeholder="Titolo" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Tipo</option><option value="correttiva">Correttiva</option><option value="preventiva">Preventiva</option><option value="miglioramento">Miglioramento</option>
              </select>
              <select value={formData.priority || ''} onChange={e => setFormData({...formData, priority: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Priorità</option><option value="low">Bassa</option><option value="medium">Media</option><option value="high">Alta</option><option value="critical">Critica</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Responsabile" value={formData.owner || ''} onChange={e => setFormData({...formData, owner: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
              <input type="date" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-slate-200">Annulla</button>
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-green-600 text-white">Crea</button>
            </div>
          </form>
        );
      case 'audit':
        return (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" placeholder="Codice" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <input type="text" placeholder="Titolo" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Tipo</option><option value="interno">Interno</option><option value="esterno">Esterno</option><option value="fornitore">Fornitore</option>
              </select>
              <select value={formData.iso || ''} onChange={e => setFormData({...formData, iso: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">ISO</option><option value="9001">9001</option><option value="14001">14001</option><option value="45001">45001</option><option value="Tutti">Tutti</option>
              </select>
            </div>
            <input type="text" placeholder="Auditor" value={formData.auditor || ''} onChange={e => setFormData({...formData, auditor: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" placeholder="Data inizio" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
              <input type="date" placeholder="Data fine" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-slate-200">Annulla</button>
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-purple-600 text-white">Crea</button>
            </div>
          </form>
        );
      case 'training':
        return (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" placeholder="Corso" value={formData.course || ''} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" required>
                <option value="">Tipo</option><option value="sicurezza">Sicurezza</option><option value="qualita">Qualità</option><option value="ambiente">Ambiente</option><option value="tecnica">Tecnica</option>
              </select>
              <input type="number" placeholder="Partecipanti" value={formData.participants || ''} onChange={e => setFormData({...formData, participants: e.target.value})} className="px-4 py-2.5 rounded-lg border border-slate-200" />
            </div>
            <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <input type="text" placeholder="Formatore" value={formData.trainer || ''} onChange={e => setFormData({...formData, trainer: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" required />
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-slate-200">Annulla</button>
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-amber-600 text-white">Crea</button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const modalTitles = { document: 'Nuovo Documento', nonconformity: 'Nuova Non Conformità', action: 'Nuova Azione', audit: 'Nuovo Audit', training: 'Nuovo Corso' };

  // ==================== MAIN RENDER ====================

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 flex items-center justify-center"><Layers size={22} className="text-white" /></div>
            <div><h1 className="text-lg font-bold">IMS Pro</h1><p className="text-xs text-slate-400">Sistema Integrato</p></div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <div className="px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase mb-3">Principale</p><SidebarItem icon={BarChart2} label="Dashboard" active={activeSection === 'dashboard'} onClick={() => navigateTo('dashboard')} /></div>
          <div className="px-4 py-3"><p className="text-xs font-semibold text-slate-500 uppercase mb-3">Gestione</p><SidebarItem icon={FileText} label="Documenti" active={activeSection === 'documents'} onClick={() => navigateTo('documents')} badge={stats.documentsReview} /><SidebarItem icon={AlertTriangle} label="Non Conformità" active={activeSection === 'nonconformities'} onClick={() => navigateTo('nonconformities')} badge={stats.ncCritical} /><SidebarItem icon={CheckSquare} label="Azioni" active={activeSection === 'actions'} onClick={() => navigateTo('actions')} /><SidebarItem icon={Calendar} label="Audit" active={activeSection === 'audits'} onClick={() => navigateTo('audits')} /><SidebarItem icon={Users} label="Formazione" active={activeSection === 'training'} onClick={() => navigateTo('training')} /></div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 cursor-pointer" onClick={logout}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">AD</div>
            <div className="flex-1"><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-slate-400">{user.role}</p></div>
            <LogOut size={18} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={20} /></button>
            <h1 className="text-xl font-bold capitalize">{activeSection}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl"><Bell size={20} /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl"><MessageSquare size={20} /></button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {activeSection === 'dashboard' && renderDashboard()}
              {activeSection === 'documents' && renderDocuments()}
              {activeSection === 'nonconformities' && renderNonConformities()}
              {activeSection === 'actions' && renderActions()}
              {activeSection === 'audits' && renderAudits()}
              {activeSection === 'training' && renderTraining()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitles[modalType] || 'Nuovo'}>{renderModalForm()}</Modal>
    </div>
  );
};

export default App;
