import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../AuthContext'; // Adjust path if needed
import './PaymentHistory.css'; // Optional: style file

export default function PaymentHistory() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    axios
      .get(`https://backend-nu-livid-37.vercel.app/seller/payments/${user.email}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setError('Invalid response format');
        }
      })
      .catch((err) => {
        console.error('Error fetching payment history:', err);
        setError('Failed to load payment history. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email]);

  return (
    <div className="payment-history-container" style={{ padding: '20px', maxWidth: 900, margin: 'auto' }}>
      <h2>Payment History</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Buyer</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Items</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Total ($)</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                // Filter only items sold by current seller
                const myItems = order.cartItems.filter(
                  (item) => item.sellerEmail === user.email
                );

                const subtotal = myItems.reduce(
                  (acc, item) => acc + item.price * (item.quantity || 1),
                  0
                );

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white',
                    }}
                  >
                    <td style={{ padding: '8px' }}>{order.email}</td>
                    <td style={{ padding: '8px' }}>
                      {myItems
                        .map(
                          (item) =>
                            `${item.name} (x${item.quantity || 1})`
                        )
                        .join(', ')}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      {subtotal.toFixed(2)}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td style={{ padding: '8px' }}>{order.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
