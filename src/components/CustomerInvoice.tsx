import React from 'react';
import { Customer } from '../types/customer';
import { useProductStore } from '../store/productStore';
import { Printer } from 'lucide-react';

interface CustomerInvoiceProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerInvoice: React.FC<CustomerInvoiceProps> = ({ customer, onClose }) => {
  const { products } = useProductStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const calculateOrderTotal = (order: Customer['orders'][0]) => {
    const product = products.find(p => p.id === order.productId);
    if (!product) return 0;

    return Object.entries(order.quantity).reduce((sum, [type, qty]) => {
      if (type === '2 Seater') return sum + (product.price2Seater * qty);
      if (type === '5 Seater') return sum + (product.price5Seater * qty);
      if (type === '7 Seater') return sum + (product.price7Seater * qty);
      return sum;
    }, 0);
  };

  const totalAmount = customer.orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl">
        <div className="print:block" id="invoice">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">ACS Legacy</h1>
            <p className="text-gray-600">Car Seat Specialist</p>
            <p className="text-sm text-gray-500">Invoice #{customer.id}</p>
            <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-MY')}</p>
          </div>

          {/* Customer Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone:</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Location:</p>
                <p className="font-medium">{customer.location}</p>
              </div>
              <div>
                <p className="text-gray-600">Car Model:</p>
                <p className="font-medium">{customer.carModel}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Order Details</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Variant</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order, orderIndex) => {
                  const product = products.find(p => p.id === order.productId);
                  if (!product) return null;

                  return Object.entries(order.quantity).map(([variant, qty], variantIndex) => {
                    if (qty === 0) return null;

                    const price = variant === '2 Seater' ? product.price2Seater :
                                variant === '5 Seater' ? product.price5Seater :
                                product.price7Seater;

                    return (
                      <tr key={`${orderIndex}-${variantIndex}`} className="border-b">
                        <td className="py-2">{product.name}</td>
                        <td className="py-2">{variant}</td>
                        <td className="text-right py-2">{qty}</td>
                        <td className="text-right py-2">{formatCurrency(price)}</td>
                        <td className="text-right py-2">{formatCurrency(price * qty)}</td>
                      </tr>
                    );
                  });
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right py-4 font-semibold">Total Amount:</td>
                  <td className="text-right py-4 font-semibold">{formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terms and Notes */}
          <div className="text-sm text-gray-600">
            <p className="mb-2">Terms and Conditions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All prices are in Malaysian Ringgit (MYR)</li>
              <li>Payment is due upon receipt</li>
              <li>Warranty terms apply as per product specifications</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoice;