export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price2Seater: number;
  price5Seater: number;
  price7Seater: number;
  cost2Seater: number;
  cost5Seater: number;
  cost7Seater: number;
  totalSales: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}