import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SalesData } from '../types/sales';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesChartProps {
  salesData: SalesData;
}

const SalesChart: React.FC<SalesChartProps> = ({ salesData }) => {
  // Get last 5 years of data centered on current year
  const currentYear = new Date().getFullYear();
  const last5Years = salesData.yearlyData
    .filter(d => d.year >= currentYear - 2 && d.year <= currentYear + 2)
    .sort((a, b) => a.year - b.year);

  const yearlyTotals = {
    labels: last5Years.map(d => d.year.toString()),
    datasets: [
      {
        label: 'Yearly Sales',
        data: last5Years.map(d => d.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
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
        text: '5-Year Sales Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `RM ${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <Line data={yearlyTotals} options={chartOptions} />
    </div>
  );
};

export default SalesChart;