import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'totalSales'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod_${Date.now()}`,
          totalSales: 0,
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },
      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...productData, updatedAt: new Date().toISOString() }
              : product
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },
    }),
    {
      name: 'product-storage',
    }
  )
);