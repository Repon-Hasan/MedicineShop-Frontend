// CartPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import AuthContext from '../../AuthContext';
import { Helmet } from 'react-helmet-async';

function CartPage() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`https://backend-nu-livid-37.vercel.app/user/${user.email}`);
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const fetchCart = async () => {
    if (!user?.email) return;

    try {
      const res = await axios.get(`https://backend-nu-livid-37.vercel.app/selectedMedicines/${user.email}`);
      const withQuantity = res.data.map(med => ({
        ...med,
        quantity: med.quantity || 1,
      }));
      setCart(withQuantity);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.role === 'user') {
      fetchCart();
    }
  }, [userData]);

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map(med => {
      if (med._id === id) {
        const newQuantity = Math.max(1, med.quantity + delta);
        return { ...med, quantity: newQuantity };
      }
      return med;
    });
    setCart(updatedCart);
  };

  const removeMedicine = async (id) => {
    const confirm = await Swal.fire({
      title: 'Remove this medicine?',
      text: 'Are you sure you want to remove it from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://backend-nu-livid-37.vercel.app/selectedMedicines/remove/${id}`);
        setCart(prev => prev.filter(m => m._id !== id));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Swal.fire('Removed!', 'Medicine has been removed.', 'success');
      } catch (err) {
        console.error('Failed to remove medicine:', err);
      }
    }
  };

  const clearCart = async () => {
    const confirm = await Swal.fire({
      title: 'Clear entire cart?',
      text: 'This will remove all medicines from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear all',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://backend-nu-livid-37.vercel.app/selectedMedicines/clear/${user.email}`);
        setCart([]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Swal.fire('Cleared!', 'Your cart has been emptied.', 'success');
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }
  };

  const goToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: cart,
        email: user?.email,
      },
    });
  };

  const total = cart.reduce((sum, med) => sum + med.price * med.quantity, 0);

  if (userLoading) return <p className="text-center mt-10">Loading user info...</p>;

  if (userData?.role !== 'user') {
    return (
      <div className="text-red-500 text-center mt-10 font-semibold text-lg">
        Access Denied: Only users with a "user" role can access this page.
      </div>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <Helmet>
        <title>My Cart | MediShop</title>
        <meta
          name="description"
          content={`You have ${cart.length} medicine${cart.length !== 1 ? 's' : ''} in your cart. Total amount is $${total.toFixed(2)}.`}
        />
      </Helmet>

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">My Medicine Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border text-sm sm:text-base">
              <thead className="bg-green-100">
                <tr>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Company</th>
                  <th className="border px-3 py-2">Price</th>
                  <th className="border px-3 py-2">Quantity</th>
                  <th className="border px-3 py-2">Subtotal</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((med) => (
                  <tr key={med._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{med.name}</td>
                    <td className="border px-3 py-2">{med.company}</td>
                    <td className="border px-3 py-2">${med.price.toFixed(2)}</td>
                    <td className="border px-3 py-2">
                      <div className="flex items-center space-x-1 justify-center">
                        <button className="px-2 bg-gray-300 rounded" onClick={() => updateQuantity(med._id, -1)}>-</button>
                        <span>{med.quantity}</span>
                        <button className="px-2 bg-gray-300 rounded" onClick={() => updateQuantity(med._id, 1)}>+</button>
                      </div>
                    </td>
                    <td className="border px-3 py-2">${(med.price * med.quantity).toFixed(2)}</td>
                    <td className="border px-3 py-2">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => removeMedicine(med._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <button
              onClick={clearCart}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            >
              Clear Cart
            </button>
            <p className="text-lg font-semibold text-center sm:text-right">
              Total: <span className="text-green-700">${total.toFixed(2)}</span>
            </p>
          </div>

          <div className="text-center sm:text-right">
            <button
              onClick={goToCheckout}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-base w-full sm:w-auto"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
