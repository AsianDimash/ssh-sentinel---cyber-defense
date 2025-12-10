import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Shield, Plus, Lock, Unlock, Clock, Trash2 } from 'lucide-react';

const BlockManager: React.FC = () => {
  const { blocks, unblockIp, blockIp } = useSecurity();
  const [showManualBlock, setShowManualBlock] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('Manual Block');

  const handleManualBlock = () => {
      if(manualIp) {
          blockIp(manualIp, manualReason, 'Permanent');
          setShowManualBlock(false);
          setManualIp('');
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Блоктау Менеджері</h1>
          <p className="text-slate-400 text-sm">Қара тізімді, ақ тізімді және ережелерді басқару.</p>
        </div>
        <button 
            onClick={() => setShowManualBlock(!showManualBlock)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
            <Plus size={16} />
            Қолмен Блоктау
        </button>
      </div>

      {showManualBlock && (
          <div className="glass-panel border border-slate-700 p-4 rounded-xl mb-6 flex items-end gap-4 animate-pulse-glow">
              <div className="flex-1 space-y-2">
                  <label className="text-xs text-slate-400 uppercase">IP Адрес</label>
                  <input 
                    value={manualIp}
                    onChange={(e) => setManualIp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" 
                    placeholder="192.168.x.x" 
                  />
              </div>
              <div className="flex-1 space-y-2">
                  <label className="text-xs text-slate-400 uppercase">Себебі</label>
                  <input 
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" 
                    placeholder="Suspicious activity" 
                  />
              </div>
              <button 
                onClick={handleManualBlock}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded h-[42px]"
              >
                  Блоктау
              </button>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Config Panel */}
        <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-cyan-400" />
                    Авто-Блок Ережелері
                </h3>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Макс. сәтсіз әрекеттер</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none">
                            <option>3 әрекет</option>
                            <option selected>5 әрекет</option>
                            <option>10 әрекет</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Уақыт аралығы</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none">
                            <option>1 минут</option>
                            <option>5 минут</option>
                            <option selected>10 минут</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Блоктау ұзақтығы</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none">
                            <option>1 сағат</option>
                            <option selected>24 сағат</option>
                            <option>Мәңгі</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">Авто-блок қосулы</span>
                            <div className="w-12 h-6 bg-cyan-900/50 rounded-full border border-cyan-700 relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Active Blocks List */}
        <div className="lg:col-span-2">
            <div className="glass-panel border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Белсенді Шектеулер</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/30 text-xs font-mono">
                            <tr>
                                <th className="px-6 py-3">IP Адрес</th>
                                <th className="px-6 py-3">Себебі</th>
                                <th className="px-6 py-3">Типі</th>
                                <th className="px-6 py-3">Мерзімі</th>
                                <th className="px-6 py-3 text-right">Әрекет</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {blocks.map(block => (
                                <tr key={block.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-mono text-slate-200 flex items-center gap-2">
                                        <Lock size={14} className="text-red-500" />
                                        {block.ip}
                                    </td>
                                    <td className="px-6 py-4">{block.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            block.type === 'AUTO' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-purple-900/30 text-purple-400'
                                        }`}>
                                            {block.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2 text-xs font-mono">
                                        <Clock size={12} /> {block.duration}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => unblockIp(block.id)}
                                            className="text-slate-500 hover:text-white transition-colors" 
                                            title="Блоктан шығару"
                                        >
                                            <Unlock size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {blocks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Блокталған IP-лер жоқ.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlockManager;
