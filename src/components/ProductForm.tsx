import React, { useState } from 'react';
import { Product } from '../types/product';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'totalSales'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'totalSales'>>({
    name: initialData?.name ?? '',
    imageUrl: initialData?.imageUrl ?? '',
    price2Seater: initialData?.price2Seater ?? 0,
    price5Seater: initialData?.price5Seater ?? 0,
    price7Seater: initialData?.price7Seater ?? 0,
    cost2Seater: initialData?.cost2Seater ?? 0,
    cost5Seater: initialData?.cost5Seater ?? 0,
    cost7Seater: initialData?.cost7Seater ?? 0,
    status: initialData?.status ?? 'active',
    createdAt: initialData?.createdAt ?? new Date().toISOString(),
    updatedAt: initialData?.updatedAt ?? new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium mb-2">2 Seater</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (RM)</label>
              <input
                type="number"
                value={formData.price2Seater}
                onChange={(e) => setFormData({ ...formData, price2Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.price2Seater)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price (RM)</label>
              <input
                type="number"
                value={formData.cost2Seater}
                onChange={(e) => setFormData({ ...formData, cost2Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.cost2Seater)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">5 Seater</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (RM)</label>
              <input
                type="number"
                value={formData.price5Seater}
                onChange={(e) => setFormData({ ...formData, price5Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.price5Seater)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price (RM)</label>
              <input
                type="number"
                value={formData.cost5Seater}
                onChange={(e) => setFormData({ ...formData, cost5Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.cost5Seater)}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">7 Seater</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (RM)</label>
              <input
                type="number"
                value={formData.price7Seater}
                onChange={(e) => setFormData({ ...formData, price7Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.price7Seater)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price (RM)</label>
              <input
                type="number"
                value={formData.cost7Seater}
                onChange={(e) => setFormData({ ...formData, cost7Seater: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                min="0"
                step="0.01"
                required
              />
              <p className="mt-1 text-sm text-gray-500">{formatCurrency(formData.cost7Seater)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;