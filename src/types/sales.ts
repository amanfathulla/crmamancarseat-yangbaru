export interface YearlySales {
  year: number;
  total: number;
}

export interface SalesData {
  id: string;
  yearlyData: YearlySales[];
  totalRevenue: number;
  yearOverYearGrowth: number;
  lastUpdated: string;
}