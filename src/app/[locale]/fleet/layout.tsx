import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Fleet | Premium Luxury Cars | RENTALX',
  description: 'Browse our premium fleet of luxury, sports, and SUV vehicles. Rent Porsche, Mercedes, Range Rover and more.',
  keywords: 'luxury car rental, sports car rental, SUV rental, premium vehicles',
};

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
