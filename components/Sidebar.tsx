import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Lock, Settings, Terminal, LogOut, X } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useSecurity();
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Басты бет' },
    { to: '/incidents', icon: <ShieldAlert size={20} />, label: 'Инциденттер' },
    { to: '/logs', icon: <Terminal size={20} />, label: 'Логтар' },
    { to: '/blocks', icon: <Lock size={20} />, label: 'Блоктау' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Баптаулар' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-[#050a14] border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <ShieldAlert className="text-white" size={18} />
            </div>
            <h1 className="font-bold text-white tracking-wider text-sm font-mono">SSH<span className="text-cyan-400">SENTINEL</span></h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()} // Close sidebar on mobile when link clicked
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'}
              `}
            >
              {({ isActive }) => (
                  <>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                      <span className="relative z-10">{item.icon}</span>
                      <span className="text-sm font-medium relative z-10">{item.label}</span>
                  </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-slate-800">
          <button 
              onClick={logout}
              className="w-full mb-4 flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
              <LogOut size={18} />
              <span className="text-sm font-medium">Шығу</span>
          </button>

          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-mono">ЖҮЙЕ БЕЛСЕНДІ</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[85%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>CPU: 12%</span>
                  <span>RAM: 240MB</span>
              </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
