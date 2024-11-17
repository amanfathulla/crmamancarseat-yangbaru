import React, { useState } from 'react';
import { TrendingUp, DollarSign, Edit2, Calendar, Plus, Trash2 } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';

const SalesTable = () => {
  const { salesData, updateYearlySales } = useSalesStore();
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear() + 1);
  const [newTotal, setNewTotal] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (year: number, currentTotal: number) => {
    setEditingYear(year);
    setEditValue(currentTotal.toString());
  };

  const handleSave = (year: number) => {
    const total = parseFloat(editValue) || 0;
    updateYearlySales(year, { total });
    setEditingYear(null);
    setEditValue('');
  };

  const handleAddYear = () => {
    if (newYear && newTotal) {
      updateYearlySales(newYear, { total: parseFloat(newTotal) || 0 });
      setShowAddYear(false);
      setNewYear(new Date().getFullYear() + 1);
      setNewTotal('');
    }
  };

  const handleDelete = (year: number) => {
    if (window.confirm(`Are you sure you want to delete the sales record for ${year}?`)) {
      const updatedYearlyData = salesData.yearlyData.filter(data => data.year !== year);
      const totalRevenue = updatedYearlyData.reduce((sum, data) => sum + data.total, 0);
      const yearOverYearGrowth = updatedYearlyData.length >= 2 ? 
        ((updatedYearlyData[updatedYearlyData.length - 1].total - updatedYearlyData[updatedYearlyData.length - 2].total) / 
        updatedYearlyData[updatedYearlyData.length - 2].total) * 100 : 0;

      useSalesStore.setState({
        salesData: {
          ...salesData,
          yearlyData: updatedYearlyData,
          totalRevenue,
          yearOverYearGrowth,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
        <p className="text-gray-600">Yearly sales records (2017-{currentYear})</p>
        <p className="text-sm text-gray-500 mt-2">Last updated: {formatDate(salesData.lastUpdated)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(salesData.totalRevenue)}</p>
          <p className="text-sm text-blue-500">All-time total</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Year-over-Year Growth</span>
          </div>
          <p className="text-2xl font-bold">{salesData.yearOverYearGrowth.toFixed(1)}%</p>
          <p className="text-sm text-green-500">Current year vs previous</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Current Year ({currentYear})</span>
          </div>
          <p className="text-2xl font-bold">
            {formatCurrency(salesData.yearlyData.find(d => d.year === currentYear)?.total || 0)}
          </p>
          <p className="text-sm text-purple-500">Year to date</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">Previous Year ({previousYear})</span>
          </div>
          <p className="text-2xl font-bold">
            {formatCurrency(salesData.yearlyData.find(d => d.year === previousYear)?.total || 0)}
          </p>
          <p className="text-sm text-orange-500">Full year total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Yearly Sales Records</h2>
            <button
              onClick={() => setShowAddYear(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Year
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesData.yearlyData
                .sort((a, b) => b.year - a.year)
                .map((yearData) => (
                <tr key={yearData.year} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{yearData.year}</span>
                    {yearData.year === currentYear && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Current
                      </span>
                    )}
                    {yearData.year === previousYear && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                        Previous
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingYear === yearData.year ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-40 px-2 py-1 border rounded"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <span className="text-gray-900">{formatCurrency(yearData.total)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingYear === yearData.year ? (
                      <button
                        onClick={() => handleSave(yearData.year)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(yearData.year, yearData.total)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(yearData.year)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Year</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  min={2017}
                  max={2030}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Sales (RM)</label>
                <input
                  type="number"
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddYear(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddYear}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Year
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;