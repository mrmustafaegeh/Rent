import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Locations | RENTALX',
  description: 'Find a RENTALX premium car rental location near you. Available in New York, Los Angeles, Miami, Chicago and more.',
  keywords: 'car rental locations, RENTALX locations, luxury car rental near me',
};

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
