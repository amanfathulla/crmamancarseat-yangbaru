import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, CustomerFormData } from '../types/customer';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: CustomerFormData) => void;
  updateCustomer: (id: string, customer: CustomerFormData) => void;
  deleteCustomer: (id: string) => void;
  getCustomersByDate: (date: string) => Customer[];
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: [],
      addCustomer: (customerData) => {
        // Calculate total sales and gross profit from orders
        const totalSales = customerData.orders.reduce((total, order) => total + order.totalAmount, 0);
        const totalGrossProfit = customerData.orders.reduce((total, order) => total + order.grossProfit, 0);

        const newCustomer: Customer = {
          ...customerData,
          id: `cust_${Date.now()}`,
          totalSales,
          totalGrossProfit,
        };

        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
      },
      updateCustomer: (id, customerData) => {
        // Recalculate totals when updating customer
        const totalSales = customerData.orders.reduce((total, order) => total + order.totalAmount, 0);
        const totalGrossProfit = customerData.orders.reduce((total, order) => total + order.grossProfit, 0);

        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? {
                  ...customer,
                  ...customerData,
                  totalSales,
                  totalGrossProfit,
                }
              : customer
          ),
        }));
      },
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }));
      },
      getCustomersByDate: (date) => {
        return get().customers.filter(customer => 
          customer.orders.some(order => order.orderDate === date)
        );
      },
    }),
    {
      name: 'customer-storage',
    }
  )
);