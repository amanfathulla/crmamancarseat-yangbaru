import React, { useState } from 'react';
import { YearlySales, YearlyColumn } from '../types/sales';
import { Plus, Trash2 } from 'lucide-react';

interface YearlySalesFormProps {
  yearData: YearlySales;
  onSubmit: (data: Partial<YearlySales>) => void;
  onCancel: () => void;
}

const YearlySalesForm: React.FC<YearlySalesFormProps> = ({
  yearData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<YearlySales>({
    ...yearData,
    customColumns: yearData.customColumns || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addColumn = () => {
    setFormData({
      ...formData,
      customColumns: [
        ...formData.customColumns,
        {
          id: `col_${Date.now()}`,
          name: '',
          value: 0
        }
      ]
    });
  };

  const removeColumn = (id: string) => {
    setFormData({
      ...formData,
      customColumns: formData.customColumns.filter(col => col.id !== id)
    });
  };

  const updateColumn = (id: string, field: 'name' | 'value', value: string | number) => {
    setFormData({
      ...formData,
      customColumns: formData.customColumns.map(col =>
        col.id === id ? { ...col, [field]: value } : col
      )
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit {formData.year} Sales Data</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Annual Sales (RM)</label>
            <input
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({
                ...formData,
                total: parseFloat(e.target.value) || 0
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              min="0"
              step="0.01"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(formData.total)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Additional Columns</h3>
              <button
                type="button"
                onClick={addColumn}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Column
              </button>
            </div>

            {formData.customColumns.map((column) => (
              <div key={column.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                    placeholder="Column name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={column.value}
                    onChange={(e) => updateColumn(column.id, 'value', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeColumn(column.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
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
              Update Sales Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YearlySalesForm;