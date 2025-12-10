import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            className="pointer-events-auto min-w-[300px] bg-[#0a1124]/90 backdrop-blur border border-slate-700 rounded-lg shadow-2xl p-4 flex items-start gap-3"
          >
            <div className={`mt-1 ${
              toast.type === 'error' ? 'text-red-500' : 
              toast.type === 'success' ? 'text-green-500' : 'text-cyan-500'
            }`}>
              {toast.type === 'error' ? <ShieldAlert size={18} /> : 
               toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold ${
                 toast.type === 'error' ? 'text-red-400' : 
                 toast.type === 'success' ? 'text-green-400' : 'text-cyan-400'
              }`}>
                {toast.type === 'error' ? 'ҚАУІП!' : toast.type === 'success' ? 'СӘТТІ' : 'АҚПАРАТ'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
