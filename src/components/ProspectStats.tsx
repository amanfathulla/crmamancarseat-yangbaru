import React from 'react';
import { UserPlus, TrendingUp, Users, Calendar } from 'lucide-react';
import { useProspectStore } from '../store/prospectStore';

const ProspectStats = () => {
  const { prospects, getProspectsByDate, getProspectsByMonth } = useProspectStore();
  
  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Calculate statistics
  const totalProspects = prospects.length;
  const dailyProspects = getProspectsByDate(todayStr).length;
  
  // Current month prospects
  const currentMonthProspects = getProspectsByMonth(
    today.getMonth(),
    today.getFullYear()
  ).length;
  
  // Previous month prospects
  const previousMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const previousYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const lastMonthProspects = getProspectsByMonth(previousMonth, previousYear).length;

  const stats = [
    {
      title: 'Total Prospects',
      value: totalProspects.toLocaleString(),
      subtext: 'All-time total',
      icon: UserPlus,
      color: 'blue',
    },
    {
      title: "Today's Prospects",
      value: dailyProspects.toLocaleString(),
      subtext: 'New leads today',
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'This Month',
      value: currentMonthProspects.toLocaleString(),
      subtext: 'Current month total',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Last Month',
      value: lastMonthProspects.toLocaleString(),
      subtext: 'Previous month total',
      icon: Users,
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            <span className="text-sm text-gray-500">{stat.title}</span>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-gray-500 mt-2">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
};

export default ProspectStats;