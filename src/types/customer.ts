export interface CustomerOrder {
  productId: string;
  quantity: {
    '2 Seater': number;
    '5 Seater': number;
    '7 Seater': number;
  };
  orderDate: string;
  totalAmount: number;
  grossProfit: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  carModel: string;
  orders: CustomerOrder[];
  createdAt: string;
  totalSales: number;
  totalGrossProfit: number;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'totalSales' | 'totalGrossProfit'> {
  id?: string;
}