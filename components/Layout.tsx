import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, ShieldAlert } from 'lucide-react';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Animated Background Grid */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
            style={{ 
                backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}>
        </div>
        
        {/* Glow Effects */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050a14]/80 backdrop-blur border-b border-slate-800 z-30 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <ShieldAlert className="text-white" size={18} />
                </div>
                <span className="font-bold text-white tracking-wider text-sm font-mono">SSH<span className="text-cyan-400">SENTINEL</span></span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
                <Menu size={24} />
            </button>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="md:ml-64 p-4 md:p-8 relative z-10 min-h-screen pt-20 md:pt-8 transition-all duration-300">
          <Outlet />
        </main>
    </div>
  );
};

export default Layout;
