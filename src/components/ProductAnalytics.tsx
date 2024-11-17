import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Product } from '../types/product';
import { useCustomerStore } from '../store/customerStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProductAnalyticsProps {
  products: Product[];
}

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ products }) => {
  const { customers } = useCustomerStore();

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // Calculate daily sales and profits
  const dailyStats = last7Days.map(date => {
    const dayOrders = customers.flatMap(customer => 
      customer.orders.filter(order => order.orderDate === date)
    );

    const revenue = dayOrders.reduce((total, order) => {
      const product = products.find(p => p.id === order.productId);
      if (!product) return total;
      
      return total + Object.entries(order.quantity).reduce((sum, [type, qty]) => {
        if (type === '2 Seater') return sum + (product.price2Seater * qty);
        if (type === '5 Seater') return sum + (product.price5Seater * qty);
        if (type === '7 Seater') return sum + (product.price7Seater * qty);
        return sum;
      }, 0);
    }, 0);

    const cost = dayOrders.reduce((total, order) => {
      const product = products.find(p => p.id === order.productId);
      if (!product) return total;
      
      return total + Object.entries(order.quantity).reduce((sum, [type, qty]) => {
        if (type === '2 Seater') return sum + (product.cost2Seater * qty);
        if (type === '5 Seater') return sum + (product.cost5Seater * qty);
        if (type === '7 Seater') return sum + (product.cost7Seater * qty);
        return sum;
      }, 0);
    }, 0);

    return {
      date,
      revenue,
      cost,
      profit: revenue - cost
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const chartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-MY', { weekday: 'short' })),
    datasets: [
      {
        label: 'Total Sales',
        data: dailyStats.map(day => day.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Gross Profit',
        data: dailyStats.map(day => day.profit),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Sales and Profit Analysis',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Amount (RM)',
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  // Calculate weekly totals
  const weeklyTotals = dailyStats.reduce((totals, day) => ({
    revenue: totals.revenue + day.revenue,
    profit: totals.profit + day.profit,
  }), { revenue: 0, profit: 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Sales</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(weeklyTotals.revenue)}</p>
          <p className="text-sm text-gray-500 mt-1">Total sales for the past 7 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Gross Profit</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(weeklyTotals.profit)}</p>
          <p className="text-sm text-gray-500 mt-1">Total profit for the past 7 days</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProductAnalytics;