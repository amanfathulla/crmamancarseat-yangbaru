import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, MessageSquare, Loader } from 'lucide-react';
import { Customer } from '../types/customer';
import { Prospect } from '../types/prospect';
import whatsappApi from '../services/whatsappApi';

interface WhatsAppSequenceFormProps {
  selectedAudience: 'all' | 'customers' | 'prospects';
  customers: Customer[];
  prospects: Prospect[];
  onClose: () => void;
}

interface SequenceMessage {
  id: string;
  day: number;
  time: string;
  message: string;
  attachments?: string[];
}

const WhatsAppSequenceForm: React.FC<WhatsAppSequenceFormProps> = ({
  selectedAudience,
  customers,
  prospects,
  onClose,
}) => {
  const [sequenceName, setSequenceName] = useState('');
  const [messages, setMessages] = useState<SequenceMessage[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const getRecipients = () => {
    let recipients: { id: string; name: string; phone: string; type: 'customer' | 'prospect' }[] = [];

    if (selectedAudience === 'all' || selectedAudience === 'customers') {
      recipients = [...recipients, ...customers.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        type: 'customer' as const
      }))];
    }

    if (selectedAudience === 'all' || selectedAudience === 'prospects') {
      recipients = [...recipients, ...prospects.map(p => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        type: 'prospect' as const
      }))];
    }

    return recipients;
  };

  const addMessage = () => {
    const newMessage: SequenceMessage = {
      id: `msg_${Date.now()}`,
      day: messages.length > 0 ? messages[messages.length - 1].day + 1 : 1,
      time: '09:00',
      message: '',
      attachments: []
    };
    setMessages([...messages, newMessage]);
  };

  const updateMessage = (id: string, field: keyof SequenceMessage, value: any) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsCreating(true);

    try {
      const selectedRecipients = getRecipients()
        .filter(r => selectedContacts.includes(r.id))
        .map(r => r.phone);

      const result = await whatsappApi.createSequence({
        name: sequenceName,
        messages: messages.map(({ day, time, message, attachments }) => ({
          day,
          time,
          message,
          attachments
        })),
        recipients: selectedRecipients
      });

      if (result.success) {
        alert('Sequence created successfully!');
        onClose();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create sequence. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const recipients = getRecipients();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Follow-up Sequence</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sequence Name</label>
            <input
              type="text"
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder="e.g., New Customer Follow-up"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {recipients.map((recipient) => (
                  <label
                    key={recipient.id}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(recipient.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, recipient.id]);
                        } else {
                          setSelectedContacts(selectedContacts.filter(id => id !== recipient.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {recipient.name} ({recipient.type})
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {selectedContacts.length} recipients selected
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Sequence Messages</label>
              <button
                type="button"
                onClick={addMessage}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Message
              </button>
            </div>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={msg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day {index + 1}</label>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={msg.day}
                          onChange={(e) => updateMessage(msg.id, 'day', parseInt(e.target.value))}
                          className="w-full rounded-lg border border-gray-200 p-2"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="time"
                          value={msg.time}
                          onChange={(e) => updateMessage(msg.id, 'time', e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <div className="flex items-start">
                      <MessageSquare className="w-5 h-5 text-gray-400 mr-2 mt-2" />
                      <textarea
                        value={msg.message}
                        onChange={(e) => updateMessage(msg.id, 'message', e.target.value)}
                        rows={3}
                        className="flex-1 rounded-lg border border-gray-200 p-2"
                        placeholder="Use {name} to include recipient's name"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => removeMessage(msg.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={selectedContacts.length === 0 || messages.length === 0 || !sequenceName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Sequence'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppSequenceForm;