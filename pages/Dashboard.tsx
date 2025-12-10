import React from 'react';
import { Shield, AlertTriangle, Activity, Globe, MapPin } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../components/StatCard';
import { useSecurity } from '../context/SecurityContext';

const Dashboard: React.FC = () => {
  const { stats, incidents, chartData } = useSecurity();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Басқару Орталығы</h1>
          <p className="text-slate-400">Жүйелік статус: <span className="text-green-400 font-mono">ҚАЛЫПТЫ</span> | Мониторинг қосулы</p>
        </div>
        <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 font-mono">СЕРВЕР УАҚЫТЫ</div>
            <div className="text-xl font-mono text-cyan-400">{new Date().toLocaleTimeString()} UTC</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Белсенді Инциденттер" 
          value={stats.activeIncidents} 
          subtitle="Бүгінгі" 
          icon={<Shield size={24} className="text-red-500" />} 
          color="red"
        />
        <StatCard 
          title="Блокталған IP-лер" 
          value={stats.blockedIps} 
          subtitle="Қазіргі уақытта" 
          icon={<AlertTriangle size={24} className="text-yellow-500" />} 
          color="yellow"
        />
        <StatCard 
          title="Жалпы Шабуылдар" 
          value={stats.totalAttacks} 
          subtitle="Соңғы 7 күнде" 
          icon={<Activity size={24} className="text-cyan-500" />} 
          color="cyan"
        />
        <StatCard 
          title="Шабуыл Елдері" 
          value={5} 
          subtitle="Негізгі: KZ, RU, CN" 
          icon={<Globe size={24} className="text-green-500" />} 
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={18} className="text-cyan-400" />
            Шабуыл Жиілігі (24 сағ)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorAttempts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Map / Feed Placeholder */}
        <div className="glass-panel rounded-xl p-6 border border-slate-800 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-purple-400" />
            Қауіп Көздері
          </h3>
          
          {/* Abstract Cyber Map Representation */}
          <div className="relative flex-1 bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden mb-4 group">
             {/* Simple SVG World Map Outline (Simplified) */}
             <svg viewBox="0 0 400 200" className="w-full h-full opacity-30 text-slate-500 fill-current">
                <path d="M20,100 Q50,50 100,80 T200,50 T300,100 T380,80 V150 H20 Z" />
             </svg>
             
             {/* Animated Pings */}
             <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
             <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
             
             <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-yellow-500 rounded-full animate-ping delay-700"></div>
             <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-yellow-500 rounded-full"></div>

             <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 rounded border border-cyan-900">
                LIVE TRAFFIC MONITOR
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-xs font-mono text-slate-500 uppercase">Соңғы Ескертулер</h4>
             {incidents.slice(0, 3).map((incident) => (
               <div key={incident.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                     <MapPin size={14} className="text-red-400" />
                     <div className="flex flex-col">
                        <span className="text-sm font-mono text-slate-200">{incident.ip}</span>
                        <span className="text-[10px] text-slate-500">{incident.country} • {incident.attempts} әрекет</span>
                     </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                      incident.status === 'BLOCKED' ? 'bg-red-900/50 text-red-400 border border-red-900' : 
                      incident.status === 'RESOLVED' ? 'bg-green-900/50 text-green-400 border border-green-900' :
                      'bg-yellow-900/50 text-yellow-400 border border-yellow-900'
                  }`}>
                    {incident.status === 'BLOCKED' ? 'БЛОК' : incident.status === 'RESOLVED' ? 'ШЕШІЛДІ' : 'КҮТУДЕ'}
                  </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
