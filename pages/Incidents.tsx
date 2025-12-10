import React, { useState } from 'react';
import { Ban, CheckCircle, Search, Filter, Eye, X, Download, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { Incident } from '../types';

const Incidents: React.FC = () => {
  const { incidents, blockIp, resolveIncident, exportData } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Filter States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BLOCKED' | 'WATCHING' | 'RESOLVED'>('ALL');
  const [threatFilter, setThreatFilter] = useState(0);

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.ip.includes(searchTerm) || inc.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesThreat = inc.threatScore >= threatFilter;
    return matchesSearch && matchesStatus && matchesThreat;
  });

  const handleBlock = (ip: string) => {
      blockIp(ip, 'Manual block from Incidents', '24h');
      setSelectedIncident(null);
  };

  const handleResolve = (id: string) => {
      resolveIncident(id);
      setSelectedIncident(null);
  };

  const resetFilters = () => {
    setStatusFilter('ALL');
    setThreatFilter(0);
    setSearchTerm('');
    setShowFilterModal(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Қауіпсіздік Инциденттері</h1>
          <p className="text-slate-400 text-sm">Анықталған қауіптерді басқару және қарау.</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="IP немесе Елді іздеу..." 
                    className="bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setShowFilterModal(true)}
                className={`p-2 border rounded-lg transition-colors ${statusFilter !== 'ALL' || threatFilter > 0 ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
            >
                <Filter size={18} />
            </button>
            <button 
                onClick={() => exportData('incidents')}
                className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                title="CSV Экспорт"
            >
                <Download size={18} />
            </button>
        </div>
      </div>

      <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900/80 text-xs uppercase font-mono text-slate-500">
                    <tr>
                        <th className="px-6 py-4 font-medium">IP Адресі</th>
                        <th className="px-6 py-4 font-medium">Деңгейі</th>
                        <th className="px-6 py-4 font-medium">Қауіп Ұпайы</th>
                        <th className="px-6 py-4 font-medium">Соңғы әрекет</th>
                        <th className="px-6 py-4 font-medium">Статус</th>
                        <th className="px-6 py-4 font-medium text-right">Әрекет</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {filteredIncidents.length > 0 ? (
                        filteredIncidents.map((incident, idx) => (
                            <motion.tr 
                                key={incident.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                            {incident.country}
                                        </div>
                                        <div>
                                            <div className="font-mono text-slate-200 font-medium">{incident.ip}</div>
                                            <div className="text-xs text-slate-500">{incident.isp}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${incident.attempts > 10 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        <span className={incident.attempts > 10 ? 'text-red-400' : 'text-yellow-400'}>
                                            {incident.attempts} әрекет
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-full max-w-[100px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${incident.threatScore > 80 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                            style={{ width: `${incident.threatScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs mt-1 block">{incident.threatScore}/100</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {incident.lastAttempt}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        incident.status === 'BLOCKED' ? 'bg-red-900/20 text-red-400 border-red-900/50' : 
                                        incident.status === 'RESOLVED' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                        'bg-yellow-900/20 text-yellow-400 border-yellow-900/50'
                                    }`}>
                                        {incident.status === 'BLOCKED' ? 'БЛОКТАЛҒАН' : incident.status === 'RESOLVED' ? 'ШЕШІЛГЕН' : 'КҮТУДЕ'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => setSelectedIncident(incident)}
                                            className="p-1.5 hover:bg-cyan-900/30 rounded text-slate-400 hover:text-cyan-400 transition-colors" 
                                            title="Толығырақ"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {incident.status !== 'BLOCKED' && incident.status !== 'RESOLVED' && (
                                            <>
                                                <button 
                                                    onClick={() => handleBlock(incident.ip)}
                                                    className="p-1.5 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400 transition-colors" 
                                                    title="Блоктау"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleResolve(incident.id)}
                                                    className="p-1.5 hover:bg-green-900/30 rounded text-slate-400 hover:text-green-400 transition-colors" 
                                                    title="Шешу"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={24} className="opacity-50" />
                                    <p>Сәйкес келетін инциденттер табылмады</p>
                                    <button onClick={resetFilters} className="text-cyan-400 text-xs hover:underline mt-1">Фильтрді тазалау</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilterModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                ></motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-sm bg-[#0a1124] border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-6"
                >
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Filter size={18} className="text-cyan-400"/> Фильтрлеу
                        </h3>
                        <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs text-slate-500 uppercase font-bold">Статус бойынша</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['ALL', 'WATCHING', 'BLOCKED', 'RESOLVED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status as any)}
                                        className={`px-3 py-2 rounded text-xs font-medium border transition-colors ${
                                            statusFilter === status 
                                            ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' 
                                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                    >
                                        {status === 'ALL' ? 'Барлығы' : status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs text-slate-500 uppercase font-bold">Қауіп Ұпайы (Min)</label>
                                <span className="text-xs text-cyan-400">{threatFilter}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={threatFilter} 
                                onChange={(e) => setThreatFilter(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            onClick={resetFilters}
                            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={14} /> Тазалау
                        </button>
                        <button 
                            onClick={() => setShowFilterModal(false)}
                            className="flex-1 py-2 rounded-lg bg-cyan-600 text-white text-sm font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/20"
                        >
                            Қолдану
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Detail Modal (Existing code) */}
      <AnimatePresence>
        {selectedIncident && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedIncident(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                ></motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0a1124] border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-red-500">⚠</span> ИНЦИДЕНТ ДЕТАЛЬДАРЫ
                        </h2>
                        <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-xs text-slate-500 uppercase">IP Адрес</div>
                                <div className="text-xl font-mono text-cyan-400">{selectedIncident.ip}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-slate-500 uppercase">Локация</div>
                                <div className="text-lg text-white">{selectedIncident.country} — {selectedIncident.isp}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-slate-500 uppercase">Қауіп Ұпайы</div>
                                <div className={`text-lg font-bold ${selectedIncident.threatScore > 80 ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {selectedIncident.threatScore}/100
                                </div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-slate-500 uppercase">Статус</div>
                                <div className="text-lg text-white">{selectedIncident.status}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase">Шабуыл Хронологиясы</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Алғашқы әрекет:</span>
                                    <span className="font-mono text-slate-200">{selectedIncident.firstAttempt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Соңғы әрекет:</span>
                                    <span className="font-mono text-slate-200">{selectedIncident.lastAttempt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Жалпы сәтсіз әрекеттер:</span>
                                    <span className="font-mono text-red-400 font-bold">{selectedIncident.attempts}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-300 uppercase">Қолданылған логиндер</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedIncident.usernames.map(u => (
                                    <span key={u} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-purple-300 font-mono">
                                        {u}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
                        <button 
                            onClick={() => handleBlock(selectedIncident.ip)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Ban size={18} /> Блоктау
                        </button>
                        <button 
                            onClick={() => handleResolve(selectedIncident.id)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                           Инцидентті жабу
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Incidents;
