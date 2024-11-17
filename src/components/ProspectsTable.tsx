import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useProspectStore } from '../store/prospectStore';
import ProspectForm from './ProspectForm';
import { Prospect } from '../types/prospect';
import ProspectStats from './ProspectStats';

const ProspectsTable = () => {
  const { prospects, addProspect, updateProspect, deleteProspect } = useProspectStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      deleteProspect(id);
    }
  };

  const filteredProspects = prospects.filter((prospect) =>
    Object.values(prospect).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Prospects</h1>
        <p className="text-gray-600">Track potential customers</p>
      </div>

      <ProspectStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prospects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{prospect.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prospect.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prospect.carModel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prospect.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(prospect)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prospect.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProspects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No prospects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProspectForm
          initialData={editingProspect || undefined}
          onSubmit={(data) => {
            if (editingProspect) {
              updateProspect(editingProspect.id, data);
            } else {
              addProspect(data);
            }
            setShowForm(false);
            setEditingProspect(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProspect(null);
          }}
        />
      )}
    </div>
  );
};

export default ProspectsTable;