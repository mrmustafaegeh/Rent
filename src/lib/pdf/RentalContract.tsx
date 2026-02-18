
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register a standard font (optional, default is Helvetica)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002bc5', // Navy
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  col: {
    flex: 1,
  },
  label: {
    color: '#666',
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    color: '#000',
    flex: 1,
  },
  finePrint: {
    fontSize: 8,
    color: '#666',
    marginTop: 40,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#888',
  },
  signatureBox: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '40%',
    textAlign: 'center',
    paddingTop: 5,
    marginTop: 40,
  }
});

interface ContractProps {
  booking: any; // Using any for simplicity, but ideally typed
}

export const RentalContract = ({ booking }: ContractProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>RENTALX</Text>
          <Text>Premium Car Rental</Text>
          <Text>Kyrenia, North Cyprus</Text>
          <Text>+90 533 123 4567</Text>
        </View>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>RENTAL AGREEMENT</Text>
          <Text style={{ color: '#666' }}>#{booking.bookingNumber}</Text>
          <Text style={{ color: '#666' }}>Date: {format(new Date(booking.createdAt), 'dd MMMM yyyy')}</Text>
        </View>
      </View>

      {/* Renter Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RENTER INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{booking.customer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{booking.customer.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{booking.customer.phone || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>License No:</Text>
          <Text style={styles.value}>{booking.driversLicense || 'Pending'}</Text>
        </View>
         <View style={styles.row}>
          <Text style={styles.label}>Passport:</Text>
          <Text style={styles.value}>{booking.passport || 'Pending'}</Text>
        </View>
      </View>

      {/* Vehicle Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VEHICLE DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle:</Text>
          <Text style={styles.value}>{booking.vehicle.brand} {booking.vehicle.vehicleModel} ({booking.vehicle.year})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{booking.vehicle.category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fuel Type:</Text>
          <Text style={styles.value}>{booking.vehicle.fuelType}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Transmission:</Text>
            <Text style={styles.value}>{booking.vehicle.transmission}</Text>
        </View>
      </View>

      {/* Rental Period */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RENTAL PERIOD & LOGISTICS</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Pickup:</Text>
            <Text>{format(new Date(booking.startDate), 'dd MMM yyyy, HH:mm')}</Text>
            <Text style={{ color: '#666' }}>{booking.pickupLocation}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Dropoff:</Text>
            <Text>{format(new Date(booking.endDate), 'dd MMM yyyy, HH:mm')}</Text>
            <Text style={{ color: '#666' }}>{booking.dropoffLocation}</Text>
          </View>
        </View>
      </View>

      {/* Financials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CHARGES & PAYMENT</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{booking.paymentStatus === 'PAID' ? 'PAID IN FULL' : 'PAYMENT PENDING'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={{ ...styles.value, fontWeight: 'bold', fontSize: 12 }}>
            €{booking.totalPrice.toFixed(2)}
          </Text>
        </View>
        <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
          * Includes taxes, insurance, and fees as per standard rental terms.
          Security deposit of €500 is blocked on credit card upon pickup.
        </Text>
      </View>

      {/* Terms */}
      <View>
        <Text style={styles.sectionTitle}>TERMS & CONDITIONS</Text>
        <Text style={styles.finePrint}>
          1. The Renter agrees to return the vehicle in the same condition as received, ordinary wear and tear expected.
          2. The vehicle shall not be used for any illegal purpose, racing, or off-road driving.
          3. The Renter is responsible for all traffic fines incurred during the rental period.
          4. Insurance coverage is subject to a deductible in case of at-fault accidents.
          5. Fuel policy is "Full-to-Full". Renter must return the vehicle with a full tank.
          6. Late returns may incur additional charges equivalent to one full day rental.
          7. Smoking inside the vehicle is strictly prohibited and subject to a €200 cleaning fee.
        </Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatureBox}>
        <View style={styles.signatureLine}>
          <Text>Renter Signature</Text>
        </View>
        <View style={styles.signatureLine}>
          <Text>RentalX Representative</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        RentalX Premium Car Rental • www.rentalx.com • support@rentalx.com • Reg No: 12345678
      </Text>
    </Page>
  </Document>
);
