import React, { useState } from 'react';
import { MessageSquare, Calendar, Search, Filter, Plus, Send, Users, UserPlus } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useProspectStore } from '../store/prospectStore';
import { useWhatsAppStore } from '../store/whatsappStore';
import WhatsAppBlastForm from './WhatsAppBlastForm';
import WhatsAppSequenceForm from './WhatsAppSequenceForm';
import WhatsAppConnectionStatus from './WhatsAppConnectionStatus';

const WhatsAppManager = () => {
  const [showBlastForm, setShowBlastForm] = useState(false);
  const [showSequenceForm, setShowSequenceForm] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'customers' | 'prospects'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { customers } = useCustomerStore();
  const { prospects } = useProspectStore();
  const { campaigns, messages } = useWhatsAppStore();

  const activeSequences = campaigns.filter(c => c.status === 'active').length;
  const scheduledMessages = messages.filter(m => m.status === 'active').length;
  const totalRecipients = customers.length + prospects.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Management</h1>
        <p className="text-gray-600">Manage campaigns and follow-up sequences</p>
      </div>

      <WhatsAppConnectionStatus />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Active Sequences</span>
          </div>
          <p className="text-2xl font-bold">{activeSequences}</p>
          <p className="text-sm text-blue-500">Running campaigns</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Scheduled Messages</span>
          </div>
          <p className="text-2xl font-bold">{scheduledMessages}</p>
          <p className="text-sm text-green-500">Pending delivery</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Total Recipients</span>
          </div>
          <p className="text-2xl font-bold">{totalRecipients}</p>
          <p className="text-sm text-purple-500">Combined audience</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Send className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">Success Rate</span>
          </div>
          <p className="text-2xl font-bold">98.5%</p>
          <p className="text-sm text-orange-500">Delivery success</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowBlastForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Send className="w-6 h-6 text-blue-500 mb-2" />
              <h3 className="font-medium">Blast Message</h3>
              <p className="text-sm text-gray-500">Send to multiple recipients</p>
            </button>
            <button
              onClick={() => setShowSequenceForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="font-medium">Create Sequence</h3>
              <p className="text-sm text-gray-500">365-day follow-up plan</p>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Audience Selection</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium">Customers</h3>
                  <p className="text-sm text-gray-500">{customers.length} contacts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAudience === 'customers' || selectedAudience === 'all'}
                  onChange={(e) => setSelectedAudience(e.target.checked ? 'customers' : 'all')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <UserPlus className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h3 className="font-medium">Prospects</h3>
                  <p className="text-sm text-gray-500">{prospects.length} contacts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAudience === 'prospects' || selectedAudience === 'all'}
                  onChange={(e) => setSelectedAudience(e.target.checked ? 'prospects' : 'all')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {showBlastForm && (
        <WhatsAppBlastForm
          selectedAudience={selectedAudience}
          customers={customers}
          prospects={prospects}
          onClose={() => setShowBlastForm(false)}
        />
      )}

      {showSequenceForm && (
        <WhatsAppSequenceForm
          selectedAudience={selectedAudience}
          customers={customers}
          prospects={prospects}
          onClose={() => setShowSequenceForm(false)}
        />
      )}
    </div>
  );
};

export default WhatsAppManager;