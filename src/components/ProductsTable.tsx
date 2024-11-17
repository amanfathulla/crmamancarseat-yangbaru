import React, { useState } from 'react';
import { Search, Package, Plus, Edit2, Trash2, BarChart2, Copy } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductForm from './ProductForm';
import ProductModal from './ProductModal';
import { Product } from '../types/product';
import ProductAnalytics from './ProductAnalytics';

const ProductsTable = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleDuplicate = (product: Product) => {
    const duplicatedProduct: Omit<Product, 'id' | 'totalSales'> = {
      name: `${product.name} (Copy)`,
      imageUrl: product.imageUrl,
      price2Seater: product.price2Seater,
      price5Seater: product.price5Seater,
      price7Seater: product.price7Seater,
      cost2Seater: product.cost2Seater,
      cost5Seater: product.cost5Seater,
      cost7Seater: product.cost7Seater,
      status: product.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addProduct(duplicatedProduct);
  };

  const handleShowStats = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const totalProducts = products.length;
  const totalSales = products.reduce((sum, product) => sum + (product.totalSales || 0), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-600">Manage your car seat products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Total Products</span>
          </div>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Total Sales</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Active Products</span>
          </div>
          <p className="text-2xl font-bold">{activeProducts}</p>
        </div>
      </div>

      <ProductAnalytics products={products} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">2 Seater</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">5 Seater</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">7 Seater</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.status === 'active' ? 
                            <span className="text-green-600">Active</span> : 
                            <span className="text-gray-500">Inactive</span>
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price2Seater)}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price5Seater)}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price7Seater)}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {formatCurrency(product.totalSales || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleShowStats(product)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Statistics"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(product)}
                        className="text-green-600 hover:text-green-900"
                        title="Duplicate Product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={(data) => {
                if (editingProduct) {
                  updateProduct(editingProduct.id, data);
                } else {
                  addProduct(data);
                }
                setShowForm(false);
                setEditingProduct(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsTable;