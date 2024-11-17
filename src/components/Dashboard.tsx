import React from 'react';
import { Users, UserPlus, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import { useSalesStore } from '../store/salesStore';

const Dashboard = () => {
  const customers = useCustomerStore((state) => state.customers);
  const products = useProductStore((state) => state.products);
  const { salesData } = useSalesStore();

  // Get current date and format it
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Calculate daily metrics with specific dates
  const calculateDailyMetrics = (date: string) => {
    const dayOrders = customers
      .filter(customer => customer.orders.some(order => order.orderDate === date))
      .flatMap(customer => customer.orders.filter(order => order.orderDate === date));

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
      revenue,
      cost,
      profit: revenue - cost,
      orders: dayOrders.length
    };
  };

  const todayMetrics = calculateDailyMetrics(todayStr);
  const yesterdayMetrics = calculateDailyMetrics(yesterdayStr);

  // Calculate current month's metrics
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const monthlyMetrics = customers
    .filter(customer => customer.orders.some(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    }))
    .reduce((totals, customer) => {
      const customerOrders = customer.orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });

      const metrics = customerOrders.reduce((orderTotals, order) => {
        const product = products.find(p => p.id === order.productId);
        if (!product) return orderTotals;

        const orderRevenue = Object.entries(order.quantity).reduce((sum, [type, qty]) => {
          if (type === '2 Seater') return sum + (product.price2Seater * qty);
          if (type === '5 Seater') return sum + (product.price5Seater * qty);
          if (type === '7 Seater') return sum + (product.price7Seater * qty);
          return sum;
        }, 0);

        const orderCost = Object.entries(order.quantity).reduce((sum, [type, qty]) => {
          if (type === '2 Seater') return sum + (product.cost2Seater * qty);
          if (type === '5 Seater') return sum + (product.cost5Seater * qty);
          if (type === '7 Seater') return sum + (product.cost7Seater * qty);
          return sum;
        }, 0);

        return {
          revenue: orderTotals.revenue + orderRevenue,
          cost: orderTotals.cost + orderCost,
          orders: orderTotals.orders + 1
        };
      }, { revenue: 0, cost: 0, orders: 0 });

      return {
        revenue: totals.revenue + metrics.revenue,
        cost: totals.cost + metrics.cost,
        orders: totals.orders + metrics.orders
      };
    }, { revenue: 0, cost: 0, orders: 0 });

  const monthlyProfit = monthlyMetrics.revenue - monthlyMetrics.cost;

  const stats = [
    {
      id: 1,
      name: 'Total Revenue',
      value: formatCurrency(salesData.totalRevenue),
      icon: DollarSign,
      change: `${salesData.yearOverYearGrowth.toFixed(1)}%`,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Total Customers',
      value: customers.length.toLocaleString(),
      icon: Users,
      change: '+12.5%',
      color: 'green',
    },
    {
      id: 3,
      name: 'Total Products',
      value: products.length.toLocaleString(),
      icon: TrendingUp,
      change: '+15.3%',
      color: 'purple',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your business at a glance.</p>
        <p className="text-sm text-gray-500 mt-2">
          Current Date: {today.toLocaleDateString('en-MY', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <span className="flex items-center text-green-500 text-sm font-medium">
                {stat.change}
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Performance</h3>
          <p className="text-sm text-gray-500 mb-4">{today.toLocaleDateString('en-MY', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(todayMetrics.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gross Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(todayMetrics.profit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold text-purple-600">{todayMetrics.orders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Yesterday's Performance</h3>
          <p className="text-sm text-gray-500 mb-4">{yesterday.toLocaleDateString('en-MY', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(yesterdayMetrics.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gross Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(yesterdayMetrics.profit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold text-purple-600">{yesterdayMetrics.orders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
          <p className="text-sm text-gray-500 mb-4">{today.toLocaleDateString('en-MY', { 
            year: 'numeric',
            month: 'long'
          })}</p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyMetrics.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gross Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyProfit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-purple-600">{monthlyMetrics.orders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;