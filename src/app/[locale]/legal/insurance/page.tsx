import { LegalPage } from "@/components/features/LegalPage";

export const metadata = {
  title: "Insurance & Liability Policy | RentalX",
  description: "Detailed information about car rental insurance in North Cyprus."
};

export default function InsurancePage() {
  return (
    <LegalPage 
      title="Insurance & Liability"
      description="Understanding your coverage is essential for a stress-free journey. Here is a breakdown of our insurance policies."
      lastUpdated="February 2026"
    >
      <h3>1. Third-Party Insurance (Included)</h3>
      <p>
        All RentalX vehicles include mandatory Third-Party Liability Insurance, which covers damage to other vehicles or property and injury to others in the event of an accident.
      </p>

      <h3>2. Collision Damage Waiver (CDW)</h3>
      <p>
        CDW limits your financial liability for damage to the rental car. With CDW, you are only responsible for the "Excess" amount (the deductible), rather than the full cost of repairs.
      </p>

      <h3>3. Full Insurance (Super CDW)</h3>
      <p>
        For maximum peace of mind, we offer a "Zero Excess" upgrade. This removes your financial responsibility for most damages, including glass and tires (standard exclusions apply).
      </p>

      <h3>4. Exclusions</h3>
      <p>
        Insurance is voided if the vehicle is:
      </p>
      <ul>
        <li>Driven off-road (dirt tracks, beaches).</li>
        <li>Driven by an unauthorized person not named on the contract.</li>
        <li>Driven under the influence of alcohol or drugs.</li>
        <li>Driven across the border to South Cyprus.</li>
      </ul>

      <h3>5. Theft Protection</h3>
      <p>
        Our insurance packages include theft protection, provided the keys were not left in the vehicle and reasonable care was taken to secure the car.
      </p>
    </LegalPage>
  );
}
