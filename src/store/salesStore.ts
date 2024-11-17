import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SalesData, YearlySales } from '../types/sales';

// Get current date for latest records
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const historicalData = [
  { year: 2017, total: 90149 },
  { year: 2018, total: 291087 },
  { year: 2019, total: 416464 },
  { year: 2020, total: 608811 },
  { year: 2021, total: 475718 },
  { year: 2022, total: 394235 },
  { year: 2023, total: 59084  },
  { year: currentYear, total: 0 } // Current year data
];

interface SalesState {
  salesData: SalesData;
  updateYearlySales: (year: number, data: { total: number }) => void;
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      salesData: {
        id: 'sales_data',
        yearlyData: historicalData,
        totalRevenue: historicalData.reduce((sum, year) => sum + year.total, 0),
        yearOverYearGrowth: ((historicalData[historicalData.length - 1].total - historicalData[historicalData.length - 2].total) / historicalData[historicalData.length - 2].total) * 100,
        lastUpdated: new Date().toISOString()
      },
      updateYearlySales: (year, data) => {
        set((state) => {
          // Check if the year exists
          const existingYearIndex = state.salesData.yearlyData.findIndex(y => y.year === year);
          let newYearlyData = [...state.salesData.yearlyData];

          if (existingYearIndex >= 0) {
            // Update existing year
            newYearlyData[existingYearIndex] = {
              ...newYearlyData[existingYearIndex],
              ...data
            };
          } else {
            // Add new year
            newYearlyData.push({
              year,
              total: data.total
            });
          }

          // Sort years in ascending order
          newYearlyData = newYearlyData.sort((a, b) => a.year - b.year);

          // Calculate new total revenue
          const totalRevenue = newYearlyData.reduce((sum, year) => sum + year.total, 0);

          // Calculate year-over-year growth
          const currentYearData = newYearlyData[newYearlyData.length - 1];
          const previousYearData = newYearlyData[newYearlyData.length - 2];
          const yearOverYearGrowth = previousYearData
            ? ((currentYearData.total - previousYearData.total) / previousYearData.total) * 100
            : 0;

          return {
            salesData: {
              ...state.salesData,
              yearlyData: newYearlyData,
              totalRevenue,
              yearOverYearGrowth,
              lastUpdated: new Date().toISOString()
            }
          };
        });
      }
    }),
    {
      name: 'sales-storage'
    }
  )
);