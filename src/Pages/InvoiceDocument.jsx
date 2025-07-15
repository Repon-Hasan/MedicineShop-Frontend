// src/components/InvoiceDocument.jsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

// Optional: convert image to base64 or ensure public URL works
import logo from '../assets/logo.png';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 30,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 5,
    border: '1pt solid #000',
  },
  footer: {
    marginTop: 20,
    textAlign: 'right',
  },
});

const InvoiceDocument = ({ cartItems = [], total = 0, email, paymentId, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.title}>Invoice</Text>
      </View>

      <View style={styles.section}>
        <Text>Email: {email}</Text>
        <Text>Payment ID: {paymentId}</Text>
        <Text>Date: {date}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>#</Text>
          <Text style={styles.cell}>Medicine</Text>
          <Text style={styles.cell}>Unit Price</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Subtotal</Text>
        </View>
        {cartItems.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.cell}>{i + 1}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>${item.price.toFixed(2)}</Text>
            <Text style={styles.cell}>{item.quantity || 1}</Text>
            <Text style={styles.cell}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Total: ${parseFloat(total).toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;
