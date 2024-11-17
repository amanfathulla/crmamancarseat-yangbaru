import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BlogFormData } from '../types/blog';

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: '',
      content: '',
      imageUrl: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: 'update',
      tags: [],
      storeLocation: '',
      visitDate: '',
      visitPhotos: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addVisitPhoto = (url: string) => {
    if (url && !formData.visitPhotos?.includes(url)) {
      setFormData({
        ...formData,
        visitPhotos: [...(formData.visitPhotos || []), url],
      });
    }
  };

  const removeVisitPhoto = (urlToRemove: string) => {
    setFormData({
      ...formData,
      visitPhotos: formData.visitPhotos?.filter((url) => url !== urlToRemove) || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Post' : 'Create New Post'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogFormData['category'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="store-visit">Store Visit</option>
                <option value="update">Update</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.category === 'store-visit' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Location</label>
                <input
                  type="text"
                  value={formData.storeLocation}
                  onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Visit Date</label>
                <input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Visit Photos</label>
                <div className="mt-1 space-y-2">
                  {formData.visitPhotos?.map((url) => (
                    <div key={url} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        readOnly
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeVisitPhoto(url)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Add photo URL"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addVisitPhoto((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add photo URL"]') as HTMLInputElement;
                        addVisitPhoto(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement;
                    addTag(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Tag
                </button>
              </div>
            </div>
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
              {initialData ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;