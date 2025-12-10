import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import BlockManager from './pages/BlockManager';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import LogViewer from './components/LogViewer';
import Login from './pages/Login';
import { MOCK_LOGS } from './constants';
import { SecurityProvider, useSecurity } from './context/SecurityContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useSecurity();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/logs" element={
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Жүйелік Логтар</h1>
            <LogViewer initialLogs={MOCK_LOGS} />
          </div>
        } />
        <Route path="/blocks" element={<BlockManager />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <SecurityProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SecurityProvider>
  );
};

export default App;