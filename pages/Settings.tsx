import React from 'react';
import { Save, Bell, Database, Server, Key } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Жүйе Конфигурациясы</h1>
          <p className="text-slate-400 text-sm">Деректер көздерін, хабарламаларды және API кілттерін баптау.</p>
        </div>

        {/* General Settings */}
        <div className="glass-panel border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
                <Server size={20} className="text-cyan-400" />
                Лог Көздері
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Лог файл жолы</label>
                    <input type="text" value="/var/log/auth.log" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm font-mono focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Лог сақтау мерзімі (күн)</label>
                    <input type="number" value="30" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none" />
                </div>
            </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
                <Bell size={20} className="text-purple-400" />
                Ескертулер & Хабарламалар
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        </div>
                        <div>
                            <div className="text-white font-medium">Telegram Bot</div>
                            <div className="text-xs text-slate-500">Alert хабарламаларды көрсетілген chat ID-ға жіберу</div>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-green-900/50 rounded-full border border-green-700 relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium text-slate-300">Bot Token</label>
                    <div className="relative">
                        <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="password" value="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 text-sm font-mono focus:border-cyan-500 focus:outline-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* Database */}
        <div className="glass-panel border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
                <Database size={20} className="text-yellow-400" />
                Деректер Қоры
            </h3>
            <div className="flex gap-4">
                <label className="flex items-center gap-3 p-4 border border-cyan-500/50 bg-cyan-900/10 rounded-lg cursor-pointer w-full">
                    <input type="radio" name="db" checked className="text-cyan-500 focus:ring-cyan-500" />
                    <div>
                        <div className="font-bold text-white">SQLite</div>
                        <div className="text-xs text-slate-400">Жергілікті файл (Ұсынылады)</div>
                    </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-slate-700 bg-slate-900/30 rounded-lg cursor-pointer w-full opacity-60">
                    <input type="radio" name="db" className="text-slate-500 focus:ring-slate-500" />
                    <div>
                        <div className="font-bold text-white">MongoDB</div>
                        <div className="text-xs text-slate-400">Сыртқы кластерге қосылу</div>
                    </div>
                </label>
            </div>
        </div>

        <div className="flex justify-end">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all">
                <Save size={18} />
                Баптауларды Сақтау
            </button>
        </div>
    </div>
  );
};

export default Settings;
