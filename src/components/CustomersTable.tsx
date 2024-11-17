import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import CustomerForm from './CustomerForm';
import CustomerStats from './CustomerStats';
import { Customer } from '../types/customer';

const CustomersTable = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  const { products } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getProductName = (productId: string): string => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage your customer database</p>
      </div>

      <CustomerStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
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
              Add Customer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.carModel}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {formatCurrency(customer.totalSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                    {formatCurrency(customer.totalGrossProfit)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {customer.orders.map((order, index) => (
                        <div key={index} className="mb-1">
                          {getProductName(order.productId)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CustomerForm
          initialData={editingCustomer || undefined}
          onSubmit={(data) => {
            if (editingCustomer) {
              updateCustomer(editingCustomer.id, data);
            } else {
              addCustomer(data);
            }
            setShowForm(false);
            setEditingCustomer(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomersTable;