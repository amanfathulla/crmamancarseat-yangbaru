import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const WhatsAppIntegration = () => {
  const [message, setMessage] = useState({
    to: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your WhatsApp service
    console.log('Sending message:', message);
    alert('Message sent successfully!');
    setMessage({ to: '', message: '' });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">WhatsApp Integration</h1>
        <p className="text-gray-600">Send messages to your customers via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Messages Sent</span>
          </div>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-sm text-green-500">Last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Response Rate</span>
          </div>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-sm text-blue-500">Average response time: 5m</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Active Chats</span>
          </div>
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-purple-500">Currently active</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Send className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Send Message</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Phone</label>
            <input
              type="text"
              value={message.to}
              onChange={(e) => setMessage({ ...message, to: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="+60123456789"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message.message}
              onChange={(e) => setMessage({ ...message, message: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your message here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppIntegration;