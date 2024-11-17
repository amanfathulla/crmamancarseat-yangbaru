import React, { useState } from 'react';
import { X, Image, Link, Send, Plus, Loader } from 'lucide-react';
import { Customer } from '../types/customer';
import { Prospect } from '../types/prospect';
import whatsappApi from '../services/whatsappApi';

interface WhatsAppBlastFormProps {
  selectedAudience: 'all' | 'customers' | 'prospects';
  customers: Customer[];
  prospects: Prospect[];
  onClose: () => void;
}

const WhatsAppBlastForm: React.FC<WhatsAppBlastFormProps> = ({
  selectedAudience,
  customers,
  prospects,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0 });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSending(true);

    const selectedRecipients = getRecipients().filter(r => selectedContacts.includes(r.id));
    setSendingProgress({ current: 0, total: selectedRecipients.length });

    try {
      const messages = selectedRecipients.map(recipient => ({
        to: recipient.phone,
        message: message.replace('{name}', recipient.name),
        attachments
      }));

      const result = await whatsappApi.sendBulkMessages(messages);
      
      if (result.success) {
        alert('Messages sent successfully!');
        onClose();
      } else {
        setError(`Failed to send some messages: ${result.message}`);
      }
    } catch (error) {
      setError('Failed to send messages. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const addAttachment = (url: string) => {
    if (url && !attachments.includes(url)) {
      setAttachments([...attachments, url]);
    }
  };

  const removeAttachment = (url: string) => {
    setAttachments(attachments.filter(a => a !== url));
  };

  const recipients = getRecipients();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Send Blast Message</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                Use {'{name}'} to include recipient's name
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-200 p-3"
              placeholder="Hello {name}, ..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
            <div className="space-y-2">
              {attachments.map((url) => (
                <div key={url} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-200 p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(url)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Add attachment URL"
                  className="flex-1 rounded-lg border border-gray-200 p-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAttachment((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add attachment URL"]') as HTMLInputElement;
                    addAttachment(input.value);
                    input.value = '';
                  }}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={selectedContacts.length === 0 || !message.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sending ({sendingProgress.current}/{sendingProgress.total})
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppBlastForm;