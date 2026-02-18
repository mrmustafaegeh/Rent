import { LegalPage } from "@/components/features/LegalPage";

export const metadata = {
  title: "Terms & Conditions | RentalX",
  description: "Terms and conditions for renting a car with RentalX in North Cyprus."
};

export default function TermsPage() {
  return (
    <LegalPage 
      title="Terms & Conditions"
      description="Please read these terms and conditions carefully before using our car rental services. By booking with RentalX, you agree to be bound by these policies."
      lastUpdated="February 2026"
    >
      <h3>1. General Agreement</h3>
      <p>
        These Terms and Conditions constitute a legally binding agreement between you (the "Renter") and RentalX (the "Company") regarding the rental of vehicles in Northern Cyprus.
      </p>

      <h3>2. Driver Requirements</h3>
      <ul>
        <li>Renter must be at least 21 years of age for economy vehicles and 25 for luxury categories.</li>
        <li>A valid national or international driver's license held for at least two years is required.</li>
        <li>A valid passport or national ID must be presented at the time of pickup.</li>
      </ul>

      <h3>3. Rental Period & Extensions</h3>
      <p>
        The minimum rental period is typically 2 or 3 days depending on the season. Extensions are subject to availability and must be requested at least 24 hours before the original return time.
      </p>

      <h3>4. Use of Vehicle</h3>
      <p>
        The vehicle must only be driven on paved roads. Off-road driving (including beaches and mountain tracks) is strictly prohibited and voids all insurance. The vehicle must NOT be driven across the border to South Cyprus.
      </p>

      <h3>5. Fuel Policy</h3>
      <p>
        Vehicles are typically provided on a "Like-for-Like" basis. The renter must return the vehicle with the same level of fuel as provided at the start of the rental.
      </p>
    </LegalPage>
  );
}
