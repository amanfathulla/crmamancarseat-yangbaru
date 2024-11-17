import React from 'react';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';

const CustomerStats = () => {
  const customers = useCustomerStore((state) => state.customers);

  // Calculate total sales and gross profit
  const totalSales = customers.reduce((sum, customer) => sum + customer.totalSales, 0);
  const totalGrossProfit = customers.reduce((sum, customer) => sum + customer.totalGrossProfit, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length.toLocaleString(),
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales),
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Gross Profit',
      value: formatCurrency(totalGrossProfit),
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            <span className="text-sm text-gray-500">{stat.title}</span>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;