import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../AuthContext';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchPayments();
    }
  }, [user?.email]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`https://backend-nu-livid-37.vercel.app/user/payments/${user.email}`);
      setPayments(response.data || []);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No payment history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Transaction ID</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {payments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6">{payment.paymentId || 'N/A'}</td>
                  <td className="py-3 px-6">${parseFloat(payment.total).toFixed(2)}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
