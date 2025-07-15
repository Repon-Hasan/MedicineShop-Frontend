import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.start) params.start = filter.start.toISOString().split('T')[0];
      if (filter.end) params.end = filter.end.toISOString().split('T')[0];
      const res = await axios.get('https://backend-nu-livid-37.vercel.app/admin/sales', { params });
      setSales(res.data);
    } catch {
      Swal.fire('Error', 'Failed to fetch sales report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleFilter = () => {
    if (!filter.start || !filter.end)
      return Swal.fire('Warning', 'Please select both start and end dates', 'warning');
    fetchSales();
  };

  const handleClear = () => {
    setFilter({ start: null, end: null });
    fetchSales();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesReport");
    XLSX.writeFile(wb, "SalesReport.xlsx");
  };

  const columns = [
    { name: '#', selector: (_, i) => i + 1, width: '60px' },
    {
      name: 'Medicine',
      selector: row => row.cartItems.map(i => i.name).join(', '),
      wrap: true,
    },
    {
      name: 'Seller Email',
      selector: row => row.cartItems[0]?.sellerEmail || '-',
      wrap: true,
    },
    { name: 'Buyer Email', selector: row => row.email, wrap: true },
    { name: 'Total ($)', selector: row => parseFloat(row.total).toFixed(2), right: true },
    { name: 'Date', selector: row => new Date(row.date).toLocaleDateString(), right: true },
    { name: 'Status', selector: row => row.status, right: true },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
        Sales Report
      </h2>

      {/* Filter + Export Controls */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start md:items-end mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={filter.start}
            onChange={d => setFilter(prev => ({ ...prev, start: d }))}
            className="border rounded px-3 py-2 w-full"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <DatePicker
            selected={filter.end}
            onChange={d => setFilter(prev => ({ ...prev, end: d }))}
            className="border rounded px-3 py-2 w-full"
            placeholderText="Select end date"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            Filter
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm"
          >
            Clear
          </button>
          <CSVLink
            data={sales}
            filename="sales_report.csv"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={exportExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
          >
            Export XLSX
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
        <DataTable
          columns={columns}
          data={sales}
          pagination
          progressPending={loading}
          highlightOnHover
          striped
          responsive
          noHeader
        />
      </div>
    </div>
  );
};

export default SalesReport;
