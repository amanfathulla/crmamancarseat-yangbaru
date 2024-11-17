import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppMessage } from '../types/whatsapp';

interface WhatsAppMessageFormProps {
  initialData?: WhatsAppMessage | null;
  onSubmit: (data: Omit<WhatsAppMessage, 'id'>) => void;
  onCancel: () => void;
}

const WhatsAppMessageForm: React.FC<WhatsAppMessageFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<WhatsAppMessage, 'id'>>({
    day: initialData?.day ?? 1,
    time: initialData?.time ?? '09:00',
    message: initialData?.message ?? '',
    type: initialData?.type ?? 'text',
    status: initialData?.status ?? 'draft',
    conditions: initialData?.conditions ?? {},
    buttons: initialData?.buttons ?? [],
    media: initialData?.media,
    variables: initialData?.variables ?? [],
    lastEdited: new Date().toISOString(),
    tags: initialData?.tags ?? [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Message' : 'Create New Message'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as WhatsAppMessage['type'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="text">Text</option>
                <option value="template">Template</option>
                <option value="media">Media</option>
                <option value="button">Button</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {formData.type === 'button' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buttons</label>
              <div className="space-y-2">
                {formData.buttons?.map((button, index) => (
                  <div key={button.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => {
                        const newButtons = [...(formData.buttons || [])];
                        newButtons[index] = { ...button, text: e.target.value };
                        setFormData({ ...formData, buttons: newButtons });
                      }}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Button text"
                    />
                    <input
                      type="text"
                      value={button.action}
                      onChange={(e) => {
                        const newButtons = [...(formData.buttons || [])];
                        newButtons[index] = { ...button, action: e.target.value };
                        setFormData({ ...formData, buttons: newButtons });
                      }}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Action"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newButtons = formData.buttons?.filter((_, i) => i !== index);
                        setFormData({ ...formData, buttons: newButtons });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newButtons = [...(formData.buttons || []), { id: Date.now().toString(), text: '', action: '' }];
                    setFormData({ ...formData, buttons: newButtons });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Button
                </button>
              </div>
            </div>
          )}

          {formData.type === 'media' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Media Type</label>
                <select
                  value={formData.media?.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    media: { ...formData.media, type: e.target.value as 'image' | 'video' | 'document' }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Media URL</label>
                <input
                  type="url"
                  value={formData.media?.url}
                  onChange={(e) => setFormData({
                    ...formData,
                    media: { ...formData.media, url: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="https://"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as WhatsAppMessage['status'] })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Message' : 'Create Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppMessageForm;