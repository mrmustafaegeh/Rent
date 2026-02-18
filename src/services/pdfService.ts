import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function generateRentalContract(booking: any) {
  const doc = new jsPDF() as any;
  const { customer, vehicle, bookingNumber, startDate, endDate, totalPrice, pickupLocation, dropoffLocation } = booking;

  // Add Logo / Header
  doc.setFontSize(22);
  doc.setTextColor(10, 22, 40); // Navy
  doc.text('MEDITERRANEAN DRIVE', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Premium Car Rental Services - North Cyprus', 105, 28, { align: 'center' });

  // Divider
  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Booking Info
  doc.setFontSize(16);
  doc.setTextColor(10, 22, 40);
  doc.text(`RENTAL CONTRACT: ${bookingNumber}`, 20, 50);

  // Table Details
  const tableData = [
    ['Customer Name', `${customer.firstName} ${customer.lastName}`],
    ['Email', customer.email],
    ['Phone', customer.phone || 'N/A'],
    ['Vehicle', `${vehicle.brand} ${vehicle.vehicleModel} (${vehicle.year})`],
    ['Pickup Date', new Date(startDate).toLocaleDateString()],
    ['Return Date', new Date(endDate).toLocaleDateString()],
    ['Pickup Location', pickupLocation],
    ['Return Location', dropoffLocation],
    ['Total Amount', `EUR ${totalPrice}`],
  ];

  doc.autoTable({
    startY: 60,
    head: [['Field', 'Information']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [10, 22, 40] },
  });

  // Terms & Conditions Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Summary of Terms:', 20, finalY);
  doc.setFontSize(9);
  doc.setTextColor(100);
  const terms = [
    '- The vehicle must be returned with the same fuel level as picked up.',
    '- Smoking is strictly prohibited inside the vehicle.',
    '- Only authorized drivers listed in this contract may operate the vehicle.',
    '- Insurance covers basic CDW. Excess amount of EUR 500 applies in case of fault.',
  ];
  terms.forEach((term, i) => {
    doc.text(term, 20, finalY + 7 + (i * 5));
  });

  // Signature Block
  const sigY = finalY + 50;
  doc.line(20, sigY, 80, sigY);
  doc.text('Customer Signature', 20, sigY + 5);
  
  doc.line(130, sigY, 190, sigY);
  doc.text('Authorized Agent', 130, sigY + 5);

  return doc.output('arraybuffer');
}
