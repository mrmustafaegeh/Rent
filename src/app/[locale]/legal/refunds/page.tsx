import { LegalPage } from "@/components/features/LegalPage";

export const metadata = {
  title: "Refund & Cancellation Policy | RentalX",
  description: "Learn about our cancellation fees and refund procedures."
};

export default function RefundsPage() {
  return (
    <LegalPage 
      title="Refund & Cancellation"
      description="We understand that plans change. Here is how we handle cancellations and refunds at RentalX."
      lastUpdated="February 2026"
    >
      <h3>1. Free Cancellation</h3>
      <p>
        Cancellations made more than **48 hours** before the scheduled pickup time are eligible for a full refund of any prepaid amount.
      </p>

      <h3>2. Late Cancellations</h3>
      <p>
        If you cancel within **48 hours** of your pickup time, a cancellation fee equivalent to 1 day's rental will be applied. The remaining balance will be refunded.
      </p>

      <h3>3. No-Show Policy</h3>
      <p>
        If the renter fails to pick up the vehicle at the scheduled time without prior notification, the reservation will be marked as a "No-Show" and no refund will be issued.
      </p>

      <h3>4. Early Returns</h3>
      <p>
        No refunds are provided for vehicles returned earlier than the scheduled return date and time specified in the rental agreement.
      </p>

      <h3>5. Refund Process</h3>
      <p>
        Refunds are processed back to the original payment method. Depending on your bank, it may take 5–10 business days for the funds to appear in your account.
      </p>
    </LegalPage>
  );
}
