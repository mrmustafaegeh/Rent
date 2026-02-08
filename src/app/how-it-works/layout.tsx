import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | RENTALX Car Rental Process',
  description: 'Learn how easy it is to rent a luxury car with RENTALX. Simple 4-step process from browsing to driving.',
  keywords: 'how to rent a car, car rental process, luxury car rental guide',
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
