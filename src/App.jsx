import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle, FileText, Shield, 
  Leaf, BarChart2, Users, Calendar, Search, Bell, Menu, X,
  ChevronRight, Download, Filter, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const monthlyData = [
  { name: 'Gen', audit: 4, incident: 1, waste: 200 },
  { name: 'Feb', audit: 3, incident: 0, waste: 180 },
  { name: 'Mar', audit: 5, incident: 2, waste: 210 },
  { name: 'Apr', audit: 4, incident: 1, waste: 190 },
  { name: 'Mag', audit: 6, incident: 0, waste: 150 },
  { name: 'Giu', audit: 5, incident: 1, waste: 160 },
];

const incidentTypes = [
  { name: 'Qualità', value: 40, color: '#3b82f6' },
  { name: 'Ambiente', value: 25, color: '#10b981' },
  { name: 'Sicurezza', value: 35, color: '#f59e0b' },
];

const recentActivities = [
  { id: 1, type: 'audit', title: 'Audit Interno Rep. Produzione', date: '2023-10-24', status: 'Completato', iso: '9001' },
  { id: 2, type: 'incident', title: 'Segnalazione Rischio Chimico', date: '2023-10-23', status: 'In Analisi', iso: '45001' },
  { id: 3, type: 'action', title: 'Smaltimento Rifiuti Spec.', date: '2023-10-22', status: 'Pianificato', iso: '14001' },
  { id: 4, type: 'audit', title: 'Verifica Fornitori', date: '2023-10-20', status: 'Completato', iso: '9001' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow"
  >
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        <span>{trend}</span>
        <span className="ml-1">{trendUp ? '↑' : '↓'} vs mese scorso</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
  </motion.div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    <p className="text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const TabButton = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active 
        ? `${color} text-white shadow-lg scale-105` 
        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
    }`}
  >
    {label}
  </button>
);

// --- Views ---

const OverviewView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Audit Totali" 
        value="24" 
        trend="+12%" 
        trendUp={true} 
        icon={FileText} 
        colorClass="bg-blue-500 text-blue-500" 
      />
      <StatCard 
        title="Non Conformità" 
        value="3" 
        trend="-5%" 
        trendUp={true} 
        icon={AlertTriangle} 
        colorClass="bg-amber-500 text-amber-500" 
      />
      <StatCard 
        title="Impronta Carbonio" 
        value="1.2t" 
        trend="-2%" 
        trendUp={true} 
        icon={Leaf} 
        colorClass="bg-emerald-500 text-emerald-500" 
      />
      <StatCard 
        title="Infortuni" 
        value="0" 
        trend="Stabile" 
        trendUp={true} 
        icon={Shield} 
        colorClass="bg-red-500 text-red-500" 
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Andamento Mensile KPI</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="audit" name="Audit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="incident" name="Incidenti" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waste" name="Rifiuti (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Distribuzione Eventi</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {incidentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Qualità</span>
            <span className="font-bold">40%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Ambiente</span>
            <span className="font-bold">25%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Sicurezza</span>
            <span className="font-bold">35%</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Attività Recenti</h3>
        <button className="text-blue-600 text-sm font-medium hover:underline">Vedi tutte</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pl-2">Tipo</th>
              <th className="pb-3">Titolo</th>
              <th className="pb-3">Data</th>
              <th className="pb-3">Standard</th>
              <th className="pb-3">Stato</th>
              <th className="pb-3 pr-2"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentActivities.map((activity) => (
              <tr key={activity.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 pl-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'audit' ? 'bg-blue-100 text-blue-600' : 
                    activity.type === 'incident' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {activity.type === 'audit' ? <FileText size={16} /> : 
                     activity.type === 'incident' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                  </div>
                </td>
                <td className="py-4 font-medium text-slate-700">{activity.title}</td>
                <td className="py-4 text-slate-500">{activity.date}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    activity.iso === '9001' ? 'bg-blue-50 text-blue-700' :
                    activity.iso === '14001' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    ISO {activity.iso}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'Completato' ? 'bg-green-100 text-green-800' :
                    activity.status === 'In Analisi' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {activity.status}
                  </span>
                </td>
                <td className="py-4 pr-2 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const StandardView = ({ iso, title, color, icon: Icon, description }) => {
  const colorMap = {
    '9001': { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
    '14001': { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
    '45001': { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50' },
  };
  
  const theme = colorMap[iso];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className={`p-8 rounded-2xl ${theme.light} border border-opacity-50 border-${color}-200 flex items-center justify-between`}>
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white ${theme.text} shadow-sm`}>
              ISO {iso}
            </span>
            <h2 className={`text-2xl font-bold ${theme.text}`}>{title}</h2>
          </div>
          <p className="text-slate-600 max-w-2xl">{description}</p>
        </div>
        <div className={`p-4 rounded-full bg-white shadow-sm ${theme.text}`}>
          <Icon size={48} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Obiettivi Chiave</h3>
          <ul className="space-y-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className={`mt-1 w-2 h-2 rounded-full ${theme.bg}`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Obiettivo Strategico {i}</p>
                  <p className="text-xs text-slate-500">Scadenza: Q{i+1} 2024</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Documentazione</h3>
          <div className="space-y-3">
            {['Manuale Integrato', 'Procedure Operative', 'Registrazioni'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                <div className="flex items-center space-x-3">
                  <FileText size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{doc}</span>
                </div>
                <Download size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Azioni Correttive Aperte</h3>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <span className="text-3xl font-bold text-slate-800">2</span>
            <span className="text-xs text-slate-500">Richiedono attenzione immediata</span>
            <button className={`mt-3 px-4 py-2 rounded-lg text-xs font-bold text-white ${theme.bg}`}>
              Gestisci Azioni
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewView />;
      case '9001':
        return <StandardView 
          iso="9001" 
          title="Qualità" 
          color="blue"
          icon={CheckCircle}
          description="Sistema di gestione per la qualità volto a soddisfare i requisiti del cliente e migliorare la soddisfazione."
        />;
      case '14001':
        return <StandardView 
          iso="14001" 
          title="Ambiente" 
          color="emerald"
          icon={Leaf}
          description="Strumento per gestire le responsabilità ambientali in modo sistematico e contribuire alla sostenibilità."
        />;
      case '45001':
        return <StandardView 
          iso="45001" 
          title="Salute e Sicurezza" 
          color="amber"
          icon={Shield}
          description="Fornisce un quadro per migliorare la sicurezza dei dipendenti, ridurre i rischi sul posto di lavoro."
        />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">IMS Manager</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <SidebarItem 
            icon={BarChart2} 
            label="Panoramica" 
            active={activeTab === 'overview'} 
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }} 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Standard ISO
          </div>
          <SidebarItem 
            icon={CheckCircle} 
            label="ISO 9001 (Qualità)" 
            active={activeTab === '9001'} 
            onClick={() => { setActiveTab('9001'); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Leaf} 
            label="ISO 14001 (Ambiente)" 
            active={activeTab === '14001'} 
            onClick={() => { setActiveTab('14001'); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Shield} 
            label="ISO 45001 (Sicurezza)" 
            active={activeTab === '45001'} 
            onClick={() => { setActiveTab('45001'); setSidebarOpen(false); }} 
          />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-500">Quality Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cerca audit, documenti..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {/* Background Image Decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-64 opacity-10 pointer-events-none -z-10 hidden lg:block">
             <img 
              src="https://image.qwenlm.ai/public_source/84057400-7956-4c1c-8877-f266c8f47ac2/141a11675-f779-4fb7-ba91-119a954a8017.png" 
              alt="Background" 
              className="w-full h-full object-cover rounded-bl-3xl"
            />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                {activeTab === 'overview' ? 'Dashboard Integrata' : 
                 activeTab === '9001' ? 'Gestione Qualità' :
                 activeTab === '14001' ? 'Gestione Ambientale' : 'Salute e Sicurezza'}
              </h1>
              <p className="text-slate-500 mt-2">
                {activeTab === 'overview' ? 'Panoramica delle prestazioni del sistema di gestione integrato.' : 
                 'Dettaglio prestazioni e conformità dello standard selezionato.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
