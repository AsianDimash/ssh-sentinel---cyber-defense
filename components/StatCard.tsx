import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'red' | 'cyan' | 'green' | 'yellow';
}

const colorClasses = {
  red: 'text-red-500 shadow-red-500/20 border-red-500/30',
  cyan: 'text-cyan-500 shadow-cyan-500/20 border-cyan-500/30',
  green: 'text-green-500 shadow-green-500/20 border-green-500/30',
  yellow: 'text-yellow-500 shadow-yellow-500/20 border-yellow-500/30',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel p-6 rounded-xl border relative overflow-hidden group hover:bg-opacity-80 transition-all`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl ${colorClasses[color].split(' ')[0].replace('text', 'bg')}`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-xs font-mono uppercase tracking-wider">{title}</h3>
          <div className={`text-3xl font-bold mt-1 font-mono ${colorClasses[color].split(' ')[0]}`}>{value}</div>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClasses[color].replace('text', 'bg').replace('shadow', '').replace('border', '')}`}>
          {icon}
        </div>
      </div>
      
      <div className="text-slate-500 text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></span>
        {subtitle}
      </div>
    </motion.div>
  );
};

export default StatCard;
