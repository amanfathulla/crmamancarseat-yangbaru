import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useProspectStore, Prospect } from '../store/prospectStore';

const ProspectExcelImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProspect } = useProspectStore();

  const processExcelData = (data: any[]) => {
    return data.map((row) => ({
      name: row['Name'] || '',
      company: row['Company'] || '',
      email: row['Email'] || '',
      phone: row['Phone'] || '',
      status: row['Status'] || 'New',
      source: row['Source'] || '',
      lastContact: row['Last Contact'] || new Date().toISOString().split('T')[0],
      notes: row['Notes'] || '',
      potentialValue: parseFloat(row['Potential Value']) || 0,
      tags: row['Tags'] ? row['Tags'].split(',').map((tag: string) => tag.trim()) : [],
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
        
        const prospects = processExcelData(jsonData);
        prospects.forEach((prospect: Omit<Prospect, 'id'>) => {
          addProspect(prospect);
        });

        alert(`Successfully imported ${prospects.length} prospects`);
      } catch (error) {
        alert('Error processing Excel file. Please check the format and try again.');
        console.error('Excel import error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
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

export default ProspectExcelImport;