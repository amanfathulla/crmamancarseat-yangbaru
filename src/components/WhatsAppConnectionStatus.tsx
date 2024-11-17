import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Key } from 'lucide-react';
import whatsappApi from '../services/whatsappApi';

const WhatsAppConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [instanceId, setInstanceId] = useState('');

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await whatsappApi.testConnection();
      setIsConnected(result.success);
      setMessage(result.message);
    } catch (error) {
      setIsConnected(false);
      setMessage('Connection test failed');
    }
    setIsLoading(false);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save the token to localStorage
      localStorage.setItem('whatsapp_api_key', apiToken);
      localStorage.setItem('whatsapp_instance_id', instanceId);
      
      // Update the API configuration
      whatsappApi.updateConfig({
        apiKey: apiToken,
        instanceId: instanceId
      });

      // Test the connection
      const result = await whatsappApi.testConnection();
      setIsConnected(result.success);
      setMessage(result.message);
      
      if (result.success) {
        setShowTokenForm(false);
      }
    } catch (error) {
      setIsConnected(false);
      setMessage('Failed to connect with provided token');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check for saved token on component mount
    const savedToken = localStorage.getItem('whatsapp_api_key');
    const savedInstanceId = localStorage.getItem('whatsapp_instance_id');
    
    if (savedToken && savedInstanceId) {
      setApiToken(savedToken);
      setInstanceId(savedInstanceId);
      whatsappApi.updateConfig({
        apiKey: savedToken,
        instanceId: savedInstanceId
      });
      testConnection();
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <div>
            <h3 className="font-medium">WhatsApp API Status</h3>
            <p className="text-sm text-gray-500">
              {isConnected ? 'Connected to OnSend.io' : 'Not connected to OnSend.io'}
              {message && ` - ${message}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTokenForm(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Key className="w-4 h-4 mr-2" />
            Configure API
          </button>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Connection
          </button>
        </div>
      </div>

      {showTokenForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Configure OnSend API</h2>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Token
                </label>
                <input
                  type="text"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2"
                  placeholder="Enter your OnSend API token"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instance ID
                </label>
                <input
                  type="text"
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2"
                  placeholder="Enter your OnSend instance ID"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTokenForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppConnectionStatus;