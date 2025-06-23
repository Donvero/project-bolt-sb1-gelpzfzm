import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import IntelligencePage from './pages/IntelligencePage';
import CompliancePage from './pages/CompliancePage';
import BudgetPage from './pages/BudgetPage';
import ProcurementPage from './pages/ProcurementPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import AlertsPage from './pages/AlertsPage';
import WorkflowIntelligencePage from './pages/WorkflowIntelligencePage';
import MobileUXPage from './pages/MobileUXPage';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/workflow-intelligence" element={<WorkflowIntelligencePage />} />
          <Route path="/mobile-ux" element={<MobileUXPage />} />
          {user?.role === 'admin' && (
            <Route path="/users" element={<UsersPage />} />
          )}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </Box>
  );
}

export default App;