import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, Severity } from '../types';
import { Pause, Play, Trash2, Download, AlertTriangle, Info, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { api } from '../services/api';

interface LogViewerProps {
  initialLogs: LogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = () => {
  const { logs, exportData } = useSecurity();
  const [localLogs, setLocalLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch logs from server
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const serverLogs = await api.getLogs();
      // Map severity strings to enum
      const mappedLogs = serverLogs.map((log: any) => ({
        ...log,
        severity: log.severity === 'CRITICAL' ? Severity.CRITICAL :
          log.severity === 'WARNING' ? Severity.WARNING :
            Severity.INFO
      }));
      setLocalLogs(mappedLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto-refresh every 3 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = 0; // Show newest at top
    }
  }, [localLogs, isPaused]);

  // Combine context logs with local logs (deduplicated)
  const allLogs = [...localLogs];

  // Manual refresh handler
  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
          <h2 className="font-mono text-sm font-bold text-cyan-400 tracking-wider">
            {isPaused ? 'PAUSED_' : isLoading ? 'LOADING..._' : 'LIVE LOG STREAM_'}
          </h2>
          <span className="text-xs text-slate-500 ml-2">({allLogs.length} logs)</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white ${isLoading ? 'animate-spin' : ''}`}
            title="Жаңарту"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title={isPaused ? "Жалғастыру" : "Пауза"}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={() => exportData('logs')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="CSV Жүктеу"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Log Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-[#0a0f1c]" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {allLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`grid grid-cols-12 gap-2 p-1.5 rounded hover:bg-slate-800/50 transition-colors border-l-2 ${log.severity === Severity.CRITICAL || log.severity === 'CRITICAL' ? 'border-red-500 bg-red-950/10' :
                  log.severity === Severity.WARNING || log.severity === 'WARNING' ? 'border-yellow-500 bg-yellow-950/10' :
                    'border-green-500/30'
                }`}
            >
              <div className="col-span-2 text-slate-500">[{log.timestamp}]</div>
              <div className="col-span-1">
                {(log.severity === Severity.CRITICAL || log.severity === 'CRITICAL') && <span className="text-red-500 font-bold flex items-center gap-1"><ShieldAlert size={10} /> CRIT</span>}
                {(log.severity === Severity.WARNING || log.severity === 'WARNING') && <span className="text-yellow-500 font-bold flex items-center gap-1"><AlertTriangle size={10} /> WARN</span>}
                {(log.severity === Severity.INFO || log.severity === 'INFO') && <span className="text-green-500 font-bold flex items-center gap-1"><Info size={10} /> INFO</span>}
              </div>
              <div className="col-span-2 text-cyan-400">{log.ip} <span className="text-slate-600">({log.country})</span></div>
              <div className="col-span-2 text-purple-400">{log.user}</div>
              <div className="col-span-5 text-slate-300 truncate" title={log.message}>{log.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {allLogs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <p>Деректер ағынын күтуде...</p>
            <button onClick={handleRefresh} className="mt-2 text-cyan-400 hover:underline text-sm">
              Жаңарту үшін басыңыз
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
