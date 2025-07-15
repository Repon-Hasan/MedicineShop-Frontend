// src/pages/InvoicePage.jsx
import React from 'react';
import { useLocation } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from './InvoiceDocument';

const InvoicePage = () => {
  const { state } = useLocation();
  const { cartItems = [], total = 0, email = '', paymentId = 'N/A' } = state || {};
  const currentDate = new Date().toLocaleString();

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Invoice Preview</h1>

      <p><strong>Email:</strong> {email}</p>
      <p><strong>Payment ID:</strong> {paymentId}</p>
      <p><strong>Date:</strong> {currentDate}</p>

      <h2 style={{ marginTop: '2rem' }}>Items:</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>#</th>
            <th style={tableHeaderStyle}>Medicine</th>
            <th style={tableHeaderStyle}>Unit Price</th>
            <th style={tableHeaderStyle}>Qty</th>
            <th style={tableHeaderStyle}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{item.name}</td>
              <td style={tableCellStyle}>${item.price.toFixed(2)}</td>
              <td style={tableCellStyle}>{item.quantity || 1}</td>
              <td style={tableCellStyle}>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <h3>Total: ${parseFloat(total).toFixed(2)}</h3>
      </div>

      <PDFDownloadLink
        document={
          <InvoiceDocument
            cartItems={cartItems}
            total={total}
            email={email}
            paymentId={paymentId}
            date={currentDate}
          />
        }
        fileName={`Invoice-${paymentId}.pdf`}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#444',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice PDF')}
      </PDFDownloadLink>
    </div>
  );
};

const tableHeaderStyle = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f0f0f0',
  fontWeight: 'bold',
};

const tableCellStyle = {
  border: '1px solid #000',
  padding: '8px',
};

export default InvoicePage;
