import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useCustomerStore } from '../store/customerStore';
import { CustomerFormData } from '../types/customer';

const ExcelImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCustomer } = useCustomerStore();

  const processExcelData = (data: any[]) => {
    return data.map((row) => ({
      name: row['Name'] || '',
      email: row['Email'] || '',
      phone: row['Phone'] || '',
      address: row['Address'] || '',
      carModel: row['Car Model'] || '',
      totalOrders: parseInt(row['Total Orders']) || 0,
      designCode: row['Design Code'] || '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastPurchase: new Date().toISOString().split('T')[0],
      notes: row['Notes'] || '',
      tags: row['Tags'] ? row['Tags'].split(',').map((tag: string) => tag.trim()) : [],
      totalSpent: parseFloat(row['Total Spent']) || 0,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const customers = processExcelData(jsonData);
        customers.forEach((customer: CustomerFormData) => {
          addCustomer(customer);
        });

        alert(`Successfully imported ${customers.length} customers`);
      } catch (error) {
        alert('Error processing Excel file. Please check the format and try again.');
        console.error('Excel import error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Excel
      </button>
    </div>
  );
};

export default ExcelImport;