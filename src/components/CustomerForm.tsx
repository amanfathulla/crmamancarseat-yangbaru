import React, { useState } from 'react';
import { CustomerFormData } from '../types/customer';
import { useProductStore } from '../store/productStore';
import { useSalesStore } from '../store/salesStore';
import CustomerInvoice from './CustomerInvoice';
import { Plus, Trash2 } from 'lucide-react';

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { products } = useProductStore();
  const { updateYearlySales } = useSalesStore();
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      location: '',
      carModel: '',
      orders: [],
      createdAt: new Date().toISOString(),
    }
  );

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantities, setQuantities] = useState({
    '2 Seater': 0,
    '5 Seater': 0,
    '7 Seater': 0
  });
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.orders.length === 0) {
      alert('Please add at least one order');
      return;
    }

    // Calculate total sales for the order
    const totalSales = formData.orders.reduce((total, order) => total + order.totalAmount, 0);

    // Update yearly sales data
    const orderYear = new Date(orderDate).getFullYear();
    updateYearlySales(orderYear, {
      total: totalSales
    });

    onSubmit(formData);
    setShowInvoice(true);
  };

  const addOrder = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    if (quantities['2 Seater'] === 0 && quantities['5 Seater'] === 0 && quantities['7 Seater'] === 0) {
      alert('Please add at least one item quantity');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    // Calculate order total and gross profit
    const totalAmount = Object.entries(quantities).reduce((sum, [type, qty]) => {
      if (type === '2 Seater') return sum + (product.price2Seater * qty);
      if (type === '5 Seater') return sum + (product.price5Seater * qty);
      if (type === '7 Seater') return sum + (product.price7Seater * qty);
      return sum;
    }, 0);

    const totalCost = Object.entries(quantities).reduce((sum, [type, qty]) => {
      if (type === '2 Seater') return sum + (product.cost2Seater * qty);
      if (type === '5 Seater') return sum + (product.cost5Seater * qty);
      if (type === '7 Seater') return sum + (product.cost7Seater * qty);
      return sum;
    }, 0);

    const grossProfit = totalAmount - totalCost;

    setFormData({
      ...formData,
      orders: [
        ...formData.orders,
        {
          productId: selectedProduct,
          quantity: quantities,
          orderDate: orderDate,
          totalAmount,
          grossProfit
        }
      ]
    });

    // Reset form
    setSelectedProduct('');
    setQuantities({
      '2 Seater': 0,
      '5 Seater': 0,
      '7 Seater': 0
    });
  };

  const removeOrder = (index: number) => {
    setFormData({
      ...formData,
      orders: formData.orders.filter((_, i) => i !== index)
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Calculate order summary totals
  const orderSummary = formData.orders.reduce((summary, order) => ({
    totalAmount: summary.totalAmount + order.totalAmount,
    totalGrossProfit: summary.totalGrossProfit + order.grossProfit
  }), { totalAmount: 0, totalGrossProfit: 0 });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Customer' : 'Add New Customer'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Car Model</label>
              <input
                type="text"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Add Orders</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">2 Seater Quantity</label>
                  <input
                    type="number"
                    value={quantities['2 Seater']}
                    onChange={(e) => setQuantities({
                      ...quantities,
                      '2 Seater': parseInt(e.target.value) || 0
                    })}
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">5 Seater Quantity</label>
                  <input
                    type="number"
                    value={quantities['5 Seater']}
                    onChange={(e) => setQuantities({
                      ...quantities,
                      '5 Seater': parseInt(e.target.value) || 0
                    })}
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">7 Seater Quantity</label>
                  <input
                    type="number"
                    value={quantities['7 Seater']}
                    onChange={(e) => setQuantities({
                      ...quantities,
                      '7 Seater': parseInt(e.target.value) || 0
                    })}
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addOrder}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </button>
          </div>

          {formData.orders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-4">
                {formData.orders.map((order, index) => {
                  const product = products.find(p => p.id === order.productId);
                  if (!product) return null;

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Date: {order.orderDate}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantities: {Object.entries(order.quantity)
                            .filter(([_, qty]) => qty > 0)
                            .map(([type, qty]) => `${qty}x ${type}`)
                            .join(', ')}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          Total: {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          Gross Profit: {formatCurrency(order.grossProfit)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrder(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}

                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">Total Summary</h4>
                  <p className="text-blue-600">Total Amount: {formatCurrency(orderSummary.totalAmount)}</p>
                  <p className="text-green-600">Total Gross Profit: {formatCurrency(orderSummary.totalGrossProfit)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>

      {showInvoice && (
        <CustomerInvoice
          customer={{
            ...formData,
            id: 'temp_id',
            totalSales: orderSummary.totalAmount,
            totalGrossProfit: orderSummary.totalGrossProfit
          }}
          onClose={() => {
            setShowInvoice(false);
            onCancel();
          }}
        />
      )}
    </div>
  );
};

export default CustomerForm;