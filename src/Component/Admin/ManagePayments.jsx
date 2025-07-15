import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import axiosSecure from '../../utils/axiosSecure';

function ManagePayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('https://backend-nu-livid-37.vercel.app/admin/orders');
      setOrders(res.data);
    } catch {
      Swal.fire('Error', 'Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Confirm Payment',
      text: 'Are you sure you want to mark this payment as Paid?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as Paid'
    });

    if (!confirmed.isConfirmed) return;

    try {
      await axios.put(`https://backend-nu-livid-37.vercel.app/admin/orders/${id}`, {
        status: 'Paid'
      });
      setOrders(prev =>
        prev.map(o => (o._id === id ? { ...o, status: 'Paid' } : o))
      );
      Swal.fire('Updated!', 'Payment has been marked as Paid.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to update payment status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Delete Payment Record',
      text: 'Are you sure you want to delete this payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!confirmed.isConfirmed) return;

    try {
      await axios.delete(`https://backend-nu-livid-37.vercel.app/admin/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      Swal.fire('Deleted!', 'Payment record has been deleted.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to delete payment.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading payment records...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Manage Payments
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Buyer Email</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total ($)</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No payment records found.
                </td>
              </tr>
            ) : (
              orders.map((o, idx) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 break-all">{o.email}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside space-y-1">
                      {o.cartItems.map((item, i) => (
                        <li key={i}>{item.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${parseFloat(o.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        o.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleAccept(o._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Mark as Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePayments;
