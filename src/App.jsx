import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle, FileText, Shield, 
  Leaf, BarChart2, Users, Calendar, Search, Bell, Menu, X,
  ChevronRight, Download, Filter, MoreVertical, Plus, Edit, Trash2,
  Eye, Upload, Clock, TrendingUp, TrendingDown, AlertCircle,
  Folder, Tag, User, Settings, LogOut, MessageSquare, Mail,
  CheckSquare, XCircle, ArrowRight, RefreshCw, Zap, Target,
  Layers, Database, PieChart as PieChartIcon, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const kpiData = {
  quality: [
    { month: 'Gen', nc: 12, azioni: 8, audit: 4, soddisfazione: 87 },
    { month: 'Feb', nc: 10, azioni: 10, audit: 3, soddisfazione: 88 },
    { month: 'Mar', nc: 8, azioni: 12, audit: 5, soddisfazione: 89 },
    { month: 'Apr', nc: 6, azioni: 14, audit: 4, soddisfazione: 91 },
    { month: 'Mag', nc: 5, azioni: 15, audit: 6, soddisfazione: 92 },
    { month: 'Giu', nc: 4, azioni: 16, audit: 5, soddisfazione: 93 },
  ],
  environment: [
    { month: 'Gen', consumi: 450, rifiuti: 200, emissioni: 120 },
    { month: 'Feb', consumi: 430, rifiuti: 180, emissioni: 115 },
    { month: 'Mar', consumi: 440, rifiuti: 210, emissioni: 118 },
    { month: 'Apr', consumi: 420, rifiuti: 190, emissioni: 110 },
    { month: 'Mag', consumi: 400, rifiuti: 150, emissioni: 105 },
    { month: 'Giu', consumi: 390, rifiuti: 160, emissioni: 100 },
  ],
  safety: [
    { month: 'Gen', infortuni: 1, quasi: 8, formazione: 45 },
    { month: 'Feb', infortuni: 0, quasi: 6, formazione: 52 },
    { month: 'Mar', infortuni: 1, quasi: 10, formazione: 48 },
    { month: 'Apr', infortuni: 0, quasi: 5, formazione: 55 },
    { month: 'Mag', infortuni: 0, quasi: 4, formazione: 60 },
    { month: 'Giu', infortuni: 0, quasi: 3, formazione: 65 },
  ]
};

const documents = [
  { id: 1, code: 'MAN-001', title: 'Manuale Sistema Integrato', type: 'Manuale', iso: 'Tutti', revision: '3.0', date: '2024-01-15', owner: 'Qualità', status: 'approved' },
  { id: 2, code: 'PRO-001', title: 'Procedure Audit Interni', type: 'Procedura', iso: '9001', revision: '2.1', date: '2024-02-20', owner: 'Qualità', status: 'approved' },
  { id: 3, code: 'PRO-002', title: 'Gestione Rifiuti', type: 'Procedura', iso: '14001', revision: '1.5', date: '2024-03-10', owner: 'Ambiente', status: 'approved' },
  { id: 4, code: 'PRO-003', title: 'Valutazione Rischi SSL', type: 'Procedura', iso: '45001', revision: '2.0', date: '2024-01-25', owner: 'SSL', status: 'review' },
  { id: 5, code: 'IST-001', title: 'Istruzione Lavoro Produzione', type: 'Istruzione', iso: '9001', revision: '4.2', date: '2024-04-05', owner: 'Produzione', status: 'approved' },
  { id: 6, code: 'REG-001', title: 'Registro Non Conformità', type: 'Registro', iso: 'Tutti', revision: '1.0', date: '2024-05-01', owner: 'Qualità', status: 'active' },
];

const nonConformities = [
  { id: 1, code: 'NC-2024-001', title: 'Documentazione obsoleta in produzione', iso: '9001', severity: 'major', status: 'open', date: '2024-06-01', owner: 'Produzione', deadline: '2024-06-15' },
  { id: 2, code: 'NC-2024-002', title: 'Mancata formazione operatori', iso: '45001', severity: 'minor', status: 'in_progress', date: '2024-06-05', owner: 'HR', deadline: '2024-06-20' },
  { id: 3, code: 'NC-2024-003', title: 'Smaltimento rifiuti non conforme', iso: '14001', severity: 'major', status: 'closed', date: '2024-05-20', owner: 'Ambiente', deadline: '2024-06-05' },
  { id: 4, code: 'NC-2024-004', title: 'DPI non disponibili', iso: '45001', severity: 'critical', status: 'open', date: '2024-06-10', owner: 'SSL', deadline: '2024-06-12' },
  { id: 5, code: 'NC-2024-005', title: 'Calibrazione strumenti scaduta', iso: '9001', severity: 'minor', status: 'in_progress', date: '2024-06-08', owner: 'Manutenzione', deadline: '2024-06-25' },
];

const audits = [
  { id: 1, code: 'AUD-2024-001', title: 'Audit Interno Qualità', type: 'interno', iso: '9001', auditor: 'Mario Rossi', date: '2024-06-15', status: 'scheduled', findings: 0 },
  { id: 2, code: 'AUD-2024-002', title: 'Audit Fornitore ABC', type: 'fornitore', iso: '9001', auditor: 'Luca Bianchi', date: '2024-06-20', status: 'scheduled', findings: 0 },
  { id: 3, code: 'AUD-2024-003', title: 'Audit Ambientale Annuale', type: 'interno', iso: '14001', auditor: 'Anna Verdi', date: '2024-05-10', status: 'completed', findings: 3 },
  { id: 4, code: 'AUD-2024-004', title: 'Audit SSL Reparto', type: 'interno', iso: '45001', auditor: 'Giuseppe Neri', date: '2024-04-25', status: 'completed', findings: 2 },
  { id: 5, code: 'AUD-2024-005', title: 'Audit di Certificazione', type: 'esterno', iso: 'Tutti', auditor: 'Ente Certificatore', date: '2024-09-15', status: 'planned', findings: 0 },
];

const actions = [
  { id: 1, code: 'AC-2024-001', title: 'Aggiornamento procedure qualità', type: 'correttiva', priority: 'high', status: 'in_progress', progress: 65, deadline: '2024-06-30', owner: 'Qualità' },
  { id: 2, code: 'AC-2024-002', title: 'Formazione sicurezza operatori', type: 'correttiva', priority: 'critical', status: 'open', progress: 0, deadline: '2024-06-20', owner: 'SSL' },
  { id: 3, code: 'AC-2024-003', title: 'Implementazione raccolta differenziata', type: 'miglioramento', priority: 'medium', status: 'completed', progress: 100, deadline: '2024-05-31', owner: 'Ambiente' },
  { id: 4, code: 'AC-2024-004', title: 'Revisione valutazione rischi', type: 'preventiva', priority: 'high', status: 'in_progress', progress: 40, deadline: '2024-07-15', owner: 'SSL' },
  { id: 5, code: 'AC-2024-005', title: 'Digitalizzazione registri', type: 'miglioramento', priority: 'low', status: 'open', progress: 15, deadline: '2024-08-30', owner: 'IT' },
];

const trainingRecords = [
  { id: 1, course: 'Sicurezza Generale', participants: 45, date: '2024-03-15', trainer: 'Consulente Esterno', status: 'completed' },
  { id: 2, course: 'Gestione Rifiuti', participants: 12, date: '2024-04-10', trainer: 'Resp. Ambiente', status: 'completed' },
  { id: 3, course: 'Audit Interni', participants: 8, date: '2024-05-20', trainer: 'Lead Auditor', status: 'completed' },
  { id: 4, course: 'Emergenza e Primo Soccorso', participants: 20, date: '2024-06-25', trainer: 'Croce Rossa', status: 'scheduled' },
];

const indicators = [
  { name: 'Soddisfazione Cliente', target: 90, actual: 93, unit: '%', trend: 'up' },
  { name: 'NC Chiuse in Tempo', target: 95, actual: 87, unit: '%', trend: 'down' },
  { name: 'Audit Completati', target: 12, actual: 10, unit: 'n.', trend: 'up' },
  { name: 'Ore Formazione', target: 500, actual: 520, unit: 'ore', trend: 'up' },
  { name: 'Consumo Energetico', target: 400, actual: 390, unit: 'kWh', trend: 'up' },
  { name: 'Infortuni', target: 0, actual: 0, unit: 'n.', trend: 'stable' },
];

// --- Components ---

const StatusBadge = ({ status, type = 'default' }) => {
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
    approved: 'Approvato',
    active: 'Attivo',
    review: 'In Revisione',
    draft: 'Bozza',
    open: 'Aperto',
    in_progress: 'In Corso',
    closed: 'Chiuso',
    scheduled: 'Programmato',
    completed: 'Completato',
    planned: 'Pianificato',
    critical: 'Critica',
    major: 'Maggiore',
    minor: 'Minore',
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa',
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
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600',
  };
  
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className={`${colors[color]} h-2 rounded-full transition-all duration-500`} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && (
      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
        {badge}
      </span>
    )}
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
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgb(0 0 0 / 0.1)' }}
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorStyle.bg}`}>
          <Icon size={24} className={colorStyle.icon} />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${colorStyle.trend}`}>
          {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : 
           trend === 'down' ? <TrendingDown size={16} className="mr-1" /> : 
           <Activity size={16} className="mr-1" />}
          <span>{trendValue}</span>
          <span className="text-slate-400 ml-1 font-normal">vs mese scorso</span>
        </div>
      )}
    </motion.div>
  );
};

// --- Views ---

const DashboardView = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="NC Aperte" 
          value="5" 
          subtitle="2 critiche"
          trend="down" 
          trendValue="-2" 
          icon={AlertTriangle} 
          color="red"
          onClick={() => onNavigate('nonconformities')}
        />
        <StatCard 
          title="Azioni in Corso" 
          value="12" 
          subtitle="4 in ritardo"
          trend="up" 
          trendValue="+3" 
          icon={CheckSquare} 
          color="amber"
          onClick={() => onNavigate('actions')}
        />
        <StatCard 
          title="Audit Programmati" 
          value="8" 
          subtitle="Prossimi 30 giorni"
          trend="stable" 
          trendValue="0" 
          icon={Calendar} 
          color="purple"
          onClick={() => onNavigate('audits')}
        />
        <StatCard 
          title="Documenti" 
          value="156" 
          subtitle="6 in revisione"
          trend="up" 
          trendValue="+4" 
          icon={FileText} 
          color="blue"
          onClick={() => onNavigate('documents')}
        />
        <StatCard 
          title="Ore Formazione" 
          value="520" 
          subtitle="Target: 500"
          trend="up" 
          trendValue="+45" 
          icon={Users} 
          color="green"
          onClick={() => onNavigate('training')}
        />
        <StatCard 
          title="Giorni Senza Infortuni" 
          value="87" 
          subtitle="Record aziendale"
          trend="up" 
          trendValue="+7" 
          icon={Shield} 
          color="slate"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Trend Qualità</h3>
              <p className="text-sm text-slate-500">Non conformità e azioni correttive</p>
            </div>
            <div className="flex items-center space-x-2">
              <ISOBadge iso="9001" />
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={kpiData.quality}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.2)',
                    padding: '12px'
                  }} 
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="nc" name="Non Conformità" fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={2} />
                <Bar yAxisId="left" dataKey="azioni" name="Azioni Correttive" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="soddisfazione" name="Soddisfazione %" stroke="#10b981" strokeWidth={2} dot={{fill: '#10b981', strokeWidth: 2}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Environment Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Performance Ambientale</h3>
              <p className="text-sm text-slate-500">Consumi e rifiuti (kg)</p>
            </div>
            <div className="flex items-center space-x-2">
              <ISOBadge iso="14001" />
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData.environment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.2)',
                    padding: '12px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="consumi" name="Consumi kWh" fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={2} />
                <Area type="monotone" dataKey="rifiuti" name="Rifiuti kg" fill="#059669" fillOpacity={0.2} stroke="#059669" strokeWidth={2} />
                <Area type="monotone" dataKey="emissioni" name="Emissioni CO2" fill="#047857" fillOpacity={0.2} stroke="#047857" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Indicators & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Indicatori di Performance</h3>
              <p className="text-sm text-slate-500">Confronto target vs attuale</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              <FileSpreadsheet size={16} />
              <span>Esporta Report</span>
            </button>
          </div>
          <div className="space-y-5">
            {indicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-48">
                  <p className="text-sm font-medium text-slate-700">{indicator.name}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Target: {indicator.target} {indicator.unit}</span>
                    <span className={`text-xs font-bold ${indicator.actual >= indicator.target ? 'text-green-600' : 'text-amber-600'}`}>
                      Attuale: {indicator.actual} {indicator.unit}
                    </span>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        indicator.actual >= indicator.target ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${Math.min((indicator.actual / indicator.target) * 100, 100)}%` }}
                    />
                    <div 
                      className="absolute top-0 h-full w-0.5 bg-slate-400"
                      style={{ left: '100%' }}
                    />
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  indicator.trend === 'up' ? 'bg-green-100' : indicator.trend === 'down' ? 'bg-red-100' : 'bg-slate-100'
                }`}>
                  {indicator.trend === 'up' ? <TrendingUp size={16} className="text-green-600" /> : 
                   indicator.trend === 'down' ? <TrendingDown size={16} className="text-red-600" /> : 
                   <Activity size={16} className="text-slate-600" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg text-white"
        >
          <h3 className="text-lg font-bold mb-2">Azioni Rapide</h3>
          <p className="text-blue-200 text-sm mb-6">Accedi rapidamente alle funzioni principali</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('nonconformities')}
              className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Nuova Non Conformità</p>
                <p className="text-xs text-blue-200">Registra una nuova NC</p>
              </div>
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={() => onNavigate('actions')}
              className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckSquare size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Nuova Azione</p>
                <p className="text-xs text-blue-200">Crea azione correttiva</p>
              </div>
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={() => onNavigate('documents')}
              className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Upload size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Carica Documento</p>
                <p className="text-xs text-blue-200">Nuova versione</p>
              </div>
              <ArrowRight size={16} />
            </button>
            
            <button 
              onClick={() => onNavigate('audits')}
              className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Programma Audit</p>
                <p className="text-xs text-blue-200">Pianifica nuovo audit</p>
              </div>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Attività Recenti</h3>
            <p className="text-sm text-slate-500">Ultime modifiche e aggiornamenti</p>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center space-x-1">
            <span>Vedi tutte</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { icon: FileText, color: 'blue', title: 'Nuova revisione documento MAN-001', time: '2 ore fa', user: 'Marco Bianchi' },
            { icon: AlertTriangle, color: 'red', title: 'Non conformità NC-2024-004 aperta', time: '4 ore fa', user: 'Anna Verdi' },
            { icon: CheckSquare, color: 'green', title: 'Azione AC-2024-003 completata', time: '1 giorno fa', user: 'Luca Rossi' },
            { icon: Calendar, color: 'purple', title: 'Audit AUD-2024-003 completato', time: '2 giorni fa', user: 'Giuseppe Neri' },
            { icon: Users, color: 'amber', title: 'Formazione sicurezza completata', time: '3 giorni fa', user: 'HR Department' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
              <div className={`p-2.5 rounded-xl bg-${activity.color}-100`}>
                <activity.icon size={18} className={`text-${activity.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                <p className="text-xs text-slate-500">{activity.user} • {activity.time}</p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const DocumentsView = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.iso === filter || (filter === 'pending' && doc.status === 'review');
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Documentale</h2>
          <p className="text-slate-500">Archivio documenti del sistema integrato</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus size={18} />
          <span>Nuovo Documento</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cerca documenti..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Tutti gli ISO</option>
            <option value="9001">ISO 9001</option>
            <option value="14001">ISO 14001</option>
            <option value="45001">ISO 45001</option>
            <option value="Tutti">Multi-Standard</option>
            <option value="pending">In Revisione</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Codice</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Titolo</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ISO</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rev.</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-medium text-blue-600">{doc.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                      <p className="text-xs text-slate-500">{doc.owner}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <ISOBadge iso={doc.iso} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-600">{doc.revision}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-500">{doc.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Visualizza">
                        <Eye size={16} className="text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Scarica">
                        <Download size={16} className="text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Modifica">
                        <Edit size={16} className="text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Mostrati {filteredDocs.length} di {documents.length} documenti
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>
              Precedente
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">3</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Successivo
            </button>
          </div>
        </div>
      </div>

      {/* New Document Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuovo Documento">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Codice Documento</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Es. PRO-004" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Manuale</option>
                <option>Procedura</option>
                <option>Istruzione</option>
                <option>Registro</option>
                <option>Modulo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Titolo</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Inserisci titolo documento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Standard ISO</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>ISO 9001</option>
                <option>ISO 14001</option>
                <option>ISO 45001</option>
                <option>Tutti</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Proprietario</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Responsabile" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Trascina il file qui o clicca per caricare</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX fino a 10MB</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
              Annulla
            </button>
            <button type="submit" className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
              Crea Documento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const NonConformitiesView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Non Conformità</h2>
          <p className="text-slate-500">Gestione e tracciamento non conformità</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
        >
          <Plus size={18} />
          <span>Nuova NC</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Totali</p>
              <p className="text-2xl font-bold text-slate-800">5</p>
            </div>
            <div className="p-2 bg-slate-100 rounded-lg">
              <AlertTriangle size={20} className="text-slate-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Critiche</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">In Corso</p>
              <p className="text-2xl font-bold text-amber-600">2</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Chiuse (30gg)</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* NC List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Codice</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrizione</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ISO</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gravità</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Responsabile</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Scadenza</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nonConformities.map((nc) => (
                <tr key={nc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-medium text-red-600">{nc.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-800">{nc.title}</p>
                    <p className="text-xs text-slate-500">{nc.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <ISOBadge iso={nc.iso} />
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={nc.severity} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {nc.owner.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700">{nc.owner}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{nc.deadline}</span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={nc.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={16} className="text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit size={16} className="text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New NC Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuova Non Conformità">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Titolo</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Descrizione breve della NC" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Standard ISO</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>ISO 9001</option>
                <option>ISO 14001</option>
                <option>ISO 45001</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gravità</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="minor">Minore</option>
                <option value="major">Maggiore</option>
                <option value="critical">Critica</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrizione Dettagliata</label>
            <textarea className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 h-32" placeholder="Descrivi la non conformità in dettaglio..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Responsabile</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Nome responsabile" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data Scadenza</label>
              <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
              Annulla
            </button>
            <button type="submit" className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
              Crea NC
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const ActionsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Azioni Correttive e Preventive</h2>
          <p className="text-slate-500">Piano azioni e monitoraggio avanzamento</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30">
          <Plus size={18} />
          <span>Nuova Azione</span>
        </button>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {actions.map((action) => (
          <motion.div 
            key={action.id}
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${
                  action.priority === 'critical' ? 'bg-red-100' :
                  action.priority === 'high' ? 'bg-orange-100' :
                  action.priority === 'medium' ? 'bg-amber-100' : 'bg-slate-100'
                }`}>
                  <CheckSquare size={20} className={`${
                    action.priority === 'critical' ? 'text-red-600' :
                    action.priority === 'high' ? 'text-orange-600' :
                    action.priority === 'medium' ? 'text-amber-600' : 'text-slate-600'
                  }`} />
                </div>
                <div>
                  <p className="font-mono text-sm text-slate-500">{action.code}</p>
                  <h3 className="font-bold text-slate-800">{action.title}</h3>
                </div>
              </div>
              <StatusBadge status={action.status} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Avanzamento</span>
                <span className="font-medium text-slate-700">{action.progress}%</span>
              </div>
              <ProgressBar 
                value={action.progress} 
                color={action.progress === 100 ? 'green' : action.progress > 50 ? 'blue' : 'amber'} 
              />
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                    <User size={14} />
                    <span>{action.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-sm text-slate-500">
                    <Calendar size={14} />
                    <span>{action.deadline}</span>
                  </div>
                </div>
                <StatusBadge status={action.priority} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AuditsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Programma Audit</h2>
          <p className="text-slate-500">Pianificazione e gestione audit</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30">
          <Plus size={18} />
          <span>Nuovo Audit</span>
        </button>
      </div>

      {/* Calendar View Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Calendario Audit 2024</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-slate-500 rotate-180" />
            </button>
            <span className="text-sm font-medium text-slate-700">Giugno 2024</span>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">{day}</div>
          ))}
          {Array.from({ length: 30 }, (_, i) => {
            const hasAudit = [15, 20, 25].includes(i + 1);
            return (
              <div 
                key={i} 
                className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                  hasAudit ? 'bg-purple-100 text-purple-700 font-bold border-2 border-purple-300' : 
                  'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Audits List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Codice</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Titolo</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ISO</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Auditor</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-medium text-purple-600">{audit.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-800">{audit.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                      audit.type === 'interno' ? 'bg-blue-100 text-blue-700' :
                      audit.type === 'fornitore' ? 'bg-amber-100 text-amber-700' :
                      audit.type === 'esterno' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {audit.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <ISOBadge iso={audit.iso} />
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-700">{audit.auditor}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{audit.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={audit.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={16} className="text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit size={16} className="text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TrainingView = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Formazione e Competenze</h2>
          <p className="text-slate-500">Registro formazione e piano competenze</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/30">
          <Plus size={18} />
          <span>Nuovo Corso</span>
        </button>
      </div>

      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="opacity-80" />
            <span className="text-amber-100 text-sm">Ore totali</span>
          </div>
          <p className="text-4xl font-bold">520</p>
          <p className="text-amber-100 text-sm mt-2">Target annuale: 500 ore</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <span className="text-slate-500 text-sm">Completati</span>
          </div>
          <p className="text-4xl font-bold text-slate-800">3</p>
          <p className="text-green-600 text-sm mt-2">100% completamento</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <span className="text-slate-500 text-sm">Programmati</span>
          </div>
          <p className="text-4xl font-bold text-slate-800">1</p>
          <p className="text-purple-600 text-sm mt-2">Prossimo: 25 Giugno</p>
        </div>
      </div>

      {/* Training Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Registro Formazione</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Corso</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partecipanti</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Formatore</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-800">{record.course}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-700">{record.participants}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-600">{record.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-700">{record.trainer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={16} className="text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download size={16} className="text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const navigateTo = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardView onNavigate={navigateTo} />;
      case 'documents':
        return <DocumentsView />;
      case 'nonconformities':
        return <NonConformitiesView />;
      case 'actions':
        return <ActionsView />;
      case 'audits':
        return <AuditsView />;
      case 'training':
        return <TrainingView />;
      default:
        return <DashboardView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Layers size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">IMS Pro</h1>
              <p className="text-xs text-slate-400">Sistema Integrato</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Principale</p>
            <SidebarItem 
              icon={BarChart2} 
              label="Dashboard" 
              active={activeSection === 'dashboard'} 
              onClick={() => navigateTo('dashboard')}
            />
          </div>
          
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Gestione</p>
            <SidebarItem 
              icon={FileText} 
              label="Documenti" 
              active={activeSection === 'documents'} 
              onClick={() => navigateTo('documents')}
              badge={6}
            />
            <SidebarItem 
              icon={AlertTriangle} 
              label="Non Conformità" 
              active={activeSection === 'nonconformities'} 
              onClick={() => navigateTo('nonconformities')}
              badge={2}
            />
            <SidebarItem 
              icon={CheckSquare} 
              label="Azioni" 
              active={activeSection === 'actions'} 
              onClick={() => navigateTo('actions')}
              badge={4}
            />
            <SidebarItem 
              icon={Calendar} 
              label="Audit" 
              active={activeSection === 'audits'} 
              onClick={() => navigateTo('audits')}
            />
            <SidebarItem 
              icon={Users} 
              label="Formazione" 
              active={activeSection === 'training'} 
              onClick={() => navigateTo('training')}
            />
          </div>
          
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sistema</p>
            <SidebarItem 
              icon={PieChartIcon} 
              label="Report" 
              active={activeSection === 'reports'} 
              onClick={() => navigateTo('reports')}
            />
            <SidebarItem 
              icon={Settings} 
              label="Impostazioni" 
              active={activeSection === 'settings'} 
              onClick={() => navigateTo('settings')}
            />
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-400">Quality Manager</p>
            </div>
            <LogOut size={18} className="text-slate-400 hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-slate-400">IMS Pro</span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-800 font-medium capitalize">{activeSection}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cerca..." 
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64 transition-all"
              />
            </div>
            
            {/* Quick Actions */}
            <button className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
              <Zap size={16} />
              <span>Azione Rapida</span>
            </button>
            
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {notifications}
                </span>
              )}
            </button>
            
            {/* Messages */}
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none -z-10 hidden lg:block">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
