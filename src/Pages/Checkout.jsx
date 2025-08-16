import React, { useEffect, useState } from 'react';
import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const showToast = (message) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '18px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state } = useLocation();

  const cartItems = state?.cartItems || [];
  const email = state?.email || '';

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Correct useEffect dependencies to trigger properly when cart or email changes
  useEffect(() => {
    if (totalAmount > 0 && email && cartItems.length > 0) {
      axios
        .post('https://backend-nu-livid-37.vercel.app/create-payment-intent', {
          amount: Math.round(totalAmount * 100),
          email,
          cartItems,
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => {
          console.error("Stripe error:", err);
          Swal.fire("Error", "Could not initiate payment", "error");
        });
    }
  }, [totalAmount, email, cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const card = elements.getElement(CardElement);

    // Create payment method
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (pmError) {
      Swal.fire("Card Error", pmError.message, "error");
      setProcessing(false);
      return;
    }

    // Confirm card payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      Swal.fire("Payment Failed", confirmError.message, "error");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      showToast("Payment successful!");

      // Map cart items with sellerEmail fallback
      const transformedCartItems = cartItems.map(item => ({
        ...item,
        sellerEmail: item.sellerEmail || item.medicine?.sellerEmail || 'unknown',
        quantity: item.quantity || 1,
      }));

      try {
        await axios.post('https://backend-nu-livid-37.vercel.app/save-order', {
          cartItems: transformedCartItems,
          total: totalAmount.toFixed(2),
          email,
          paymentId: paymentIntent.id,
        });
      } catch (err) {
        console.error("Failed to save order:", err);
        Swal.fire("Warning", "Payment succeeded but saving order failed!", "warning");
      }

      navigate('/invoice', {
        state: {
          cartItems: transformedCartItems,
          total: totalAmount.toFixed(2),
          email,
          paymentId: paymentIntent.id,
        },
      });
    }

    setProcessing(false);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop:"8rem"
      }}
    
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem',  }}>Checkout</h2>
      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Total: ${totalAmount.toFixed(2)}
      </p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          style={{
            marginTop: '24px',
            backgroundColor: processing ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 4,
            fontSize: '16px',
            cursor: processing ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
