import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, DollarSign, Package, LayoutDashboard, LogOut, MessageSquare, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);

  const menuItems = [
    { id: '', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'prospects', icon: UserPlus, label: 'Prospects' },
    { id: 'sales', icon: DollarSign, label: 'Sales' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
    { id: 'marketing', icon: Calendar, label: 'Marketing' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === `/dashboard/${path}`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{username || 'AmanMuhsin'}</h2>
        <p className="text-sm text-gray-600">Administrator</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/dashboard/${item.id}`)}
            className={`w-full flex items-center px-6 py-3 text-left ${
              isActive(item.id)
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-left text-red-600 hover:bg-red-50 mt-4"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;