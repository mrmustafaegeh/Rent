import { LegalPage } from "@/components/features/LegalPage";

export const metadata = {
  title: "Privacy Policy | RentalX",
  description: "How RentalX handles your personal data."
};

export default function PrivacyPage() {
  return (
    <LegalPage 
      title="Privacy Policy"
      description="We value your privacy. This policy explains how we collect, use, and protect your personal information when you use RentalX."
      lastUpdated="February 2026"
    >
      <h3>1. Data Collection</h3>
      <p>
        We collect personal information such as your name, email address, phone number, and driver's license details to facilitate vehicle bookings and comply with local TRNC laws.
      </p>

      <h3>2. Use of Information</h3>
      <p>
        Your information is used solely for booking management, identity verification, and communication regarding your rental. We do not sell your personal data to third parties.
      </p>

      <h3>3. Data Security</h3>
      <p>
        We implement industry-standard security measures to protect your data. Payment information is processed securely via encrypted gateways (Stripe/PayPal) and is never stored on our servers.
      </p>

      <h3>4. Cookies</h3>
      <p>
        We use cookies to improve your browsing experience and analyze site traffic via Google Analytics. You can manage your cookie preferences through our consent banner.
      </p>
    </LegalPage>
  );
}
