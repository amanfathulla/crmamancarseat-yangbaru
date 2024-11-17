import React, { useState } from 'react';
import { MessageSquare, Calendar, Search, Filter, Plus, Edit2, Trash2, Send } from 'lucide-react';
import { useWhatsAppStore } from '../store/whatsappStore';
import WhatsAppMessageForm from './WhatsAppMessageForm';
import WhatsAppCampaignForm from './WhatsAppCampaignForm';
import WhatsAppChatbotForm from './WhatsAppChatbotForm';
import { Campaign, WhatsAppMessage } from '../types/whatsapp';

const WhatsappSequence = () => {
  const { campaigns, messages, addMessage, updateMessage, deleteMessage } = useWhatsAppStore();
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showChatbotForm, setShowChatbotForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<WhatsAppMessage | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalMessages = messages.length;
  const scheduledMessages = messages.filter(m => m.status === 'active').length;

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Sequence</h1>
        <p className="text-gray-600">Manage your 365-day customer engagement campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Active Campaigns</span>
          </div>
          <p className="text-2xl font-bold">{activeCampaigns}</p>
          <p className="text-sm text-green-500">Running smoothly</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Total Messages</span>
          </div>
          <p className="text-2xl font-bold">{totalMessages}</p>
          <p className="text-sm text-blue-500">Across all campaigns</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Send className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Scheduled</span>
          </div>
          <p className="text-2xl font-bold">{scheduledMessages}</p>
          <p className="text-sm text-purple-500">Messages ready</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-500">Response Rate</span>
          </div>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-sm text-yellow-500">Last 30 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowCampaignForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-6 h-6 text-blue-500 mb-2" />
              <h3 className="font-medium">New Campaign</h3>
              <p className="text-sm text-gray-500">Create a new message sequence</p>
            </button>
            <button
              onClick={() => setShowMessageForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="font-medium">New Message</h3>
              <p className="text-sm text-gray-500">Add to existing campaign</p>
            </button>
            <button
              onClick={() => setShowChatbotForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare className="w-6 h-6 text-purple-500 mb-2" />
              <h3 className="font-medium">Chatbot Flow</h3>
              <p className="text-sm text-gray-500">Set up automated responses</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Calendar className="w-6 h-6 text-orange-500 mb-2" />
              <h3 className="font-medium">Schedule</h3>
              <p className="text-sm text-gray-500">View upcoming messages</p>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Campaign Performance</h2>
          </div>
          <div className="space-y-4">
            {campaigns.slice(0, 4).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-gray-500">
                    {campaign.messages.length} messages • {campaign.statistics.delivered} delivered
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showMessageForm && (
        <WhatsAppMessageForm
          initialData={editingMessage}
          onSubmit={(data) => {
            if (editingMessage) {
              updateMessage(editingMessage.id, data);
            } else {
              addMessage(data);
            }
            setShowMessageForm(false);
            setEditingMessage(null);
          }}
          onCancel={() => {
            setShowMessageForm(false);
            setEditingMessage(null);
          }}
        />
      )}

      {showCampaignForm && (
        <WhatsAppCampaignForm
          initialData={editingCampaign}
          onCancel={() => {
            setShowCampaignForm(false);
            setEditingCampaign(null);
          }}
        />
      )}

      {showChatbotForm && (
        <WhatsAppChatbotForm
          onCancel={() => setShowChatbotForm(false)}
        />
      )}
    </div>
  );
};

export default WhatsappSequence;