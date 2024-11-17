import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../types/product';
import { useCustomerStore } from '../store/customerStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { customers } = useCustomerStore();

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // Calculate daily sales and profits for each variant
  const dailyStats = last7Days.map(date => {
    const dayOrders = customers.flatMap(customer => 
      customer.orders.filter(order => 
        order.orderDate === date && order.productId === product.id
      )
    );

    const stats = {
      date,
      '2 Seater': {
        units: dayOrders.reduce((sum, order) => sum + (order.quantity['2 Seater'] || 0), 0),
        revenue: dayOrders.reduce((sum, order) => sum + ((order.quantity['2 Seater'] || 0) * product.price2Seater), 0),
        cost: dayOrders.reduce((sum, order) => sum + ((order.quantity['2 Seater'] || 0) * product.cost2Seater), 0),
      },
      '5 Seater': {
        units: dayOrders.reduce((sum, order) => sum + (order.quantity['5 Seater'] || 0), 0),
        revenue: dayOrders.reduce((sum, order) => sum + ((order.quantity['5 Seater'] || 0) * product.price5Seater), 0),
        cost: dayOrders.reduce((sum, order) => sum + ((order.quantity['5 Seater'] || 0) * product.cost5Seater), 0),
      },
      '7 Seater': {
        units: dayOrders.reduce((sum, order) => sum + (order.quantity['7 Seater'] || 0), 0),
        revenue: dayOrders.reduce((sum, order) => sum + ((order.quantity['7 Seater'] || 0) * product.price7Seater), 0),
        cost: dayOrders.reduce((sum, order) => sum + ((order.quantity['7 Seater'] || 0) * product.cost7Seater), 0),
      },
    };

    return stats;
  });

  // Calculate total stats for each variant
  const variantStats = {
    '2 Seater': {
      units: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + (order.quantity['2 Seater'] || 0), 0)
      , 0),
      revenue: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['2 Seater'] || 0) * product.price2Seater), 0)
      , 0),
      cost: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['2 Seater'] || 0) * product.cost2Seater), 0)
      , 0),
    },
    '5 Seater': {
      units: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + (order.quantity['5 Seater'] || 0), 0)
      , 0),
      revenue: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['5 Seater'] || 0) * product.price5Seater), 0)
      , 0),
      cost: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['5 Seater'] || 0) * product.cost5Seater), 0)
      , 0),
    },
    '7 Seater': {
      units: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + (order.quantity['7 Seater'] || 0), 0)
      , 0),
      revenue: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['7 Seater'] || 0) * product.price7Seater), 0)
      , 0),
      cost: customers.reduce((sum, customer) => 
        sum + customer.orders
          .filter(order => order.productId === product.id)
          .reduce((orderSum, order) => orderSum + ((order.quantity['7 Seater'] || 0) * product.cost7Seater), 0)
      , 0),
    },
  };

  const chartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-MY', { weekday: 'short' })),
    datasets: [
      {
        label: 'Revenue',
        data: dailyStats.map(day => 
          day['2 Seater'].revenue + day['5 Seater'].revenue + day['7 Seater'].revenue
        ),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Gross Profit',
        data: dailyStats.map(day => 
          (day['2 Seater'].revenue + day['5 Seater'].revenue + day['7 Seater'].revenue) -
          (day['2 Seater'].cost + day['5 Seater'].cost + day['7 Seater'].cost)
        ),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Sales and Profit',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (RM)',
        },
      },
    },
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
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{product.name} - Sales Statistics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(variantStats).map(([variant, stats]) => (
            <div key={variant} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{variant}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Price:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      variant === '2 Seater' ? product.price2Seater :
                      variant === '5 Seater' ? product.price5Seater :
                      product.price7Seater
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Price:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      variant === '2 Seater' ? product.cost2Seater :
                      variant === '5 Seater' ? product.cost5Seater :
                      product.cost7Seater
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Units:</span>
                  <span className="font-medium">{stats.units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(stats.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium text-red-600">{formatCurrency(stats.cost)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Gross Profit:</span>
                  <span className="font-medium text-green-600">{formatCurrency(stats.revenue - stats.cost)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProductModal;