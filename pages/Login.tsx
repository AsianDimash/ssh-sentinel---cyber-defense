import React, { useState } from 'react';
import { ShieldAlert, Lock, User, ArrowRight } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useSecurity();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ username, password });
    if (success) {
      navigate('/');
    } else {
      // Error is handled by toast in context, but we can also set local error if needed
      setError('Қате логин немесе құпиясөз');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <ShieldAlert className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest font-mono">SSH<span className="text-cyan-400">SENTINEL</span></h1>
          <p className="text-slate-500 text-sm mt-2">ҚАУІПСІЗДІКТІ БАСҚАРУ ЖҮЙЕСІ</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel border border-slate-700 p-8 rounded-xl space-y-6 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Пайдаланушы</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Құпиясөз</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            ЖҮЙЕГЕ КІРУ <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-8">
          © 2024 Secure SSH Gateway Defense System. <br />All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
