import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Users, UserPlus, DollarSign, Package, LayoutDashboard, MessageSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomersTable from './components/CustomersTable';
import ProspectsTable from './components/ProspectsTable';
import SalesTable from './components/SalesTable';
import ProductsTable from './components/ProductsTable';
import WhatsAppManager from './components/WhatsAppManager';
import MarketingCalendar from './components/MarketingCalendar';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersTable />} />
          <Route path="/prospects" element={<ProspectsTable />} />
          <Route path="/sales" element={<SalesTable />} />
          <Route path="/products" element={<ProductsTable />} />
          <Route path="/whatsapp" element={<WhatsAppManager />} />
          <Route path="/marketing" element={<MarketingCalendar />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;