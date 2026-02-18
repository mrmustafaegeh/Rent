import { LegalPage } from "@/components/features/LegalPage";

export const metadata = {
  title: "TRNC Tourist Rental Rules | RentalX",
  description: "Official rules and regulations for tourists renting cars in Northern Cyprus."
};

export default function TouristRulesPage() {
  return (
    <LegalPage 
      title="Tourist Rental Rules"
      description="Driving in Northern Cyprus (TRNC) involves specific local laws and customs. Familiarize yourself with these rules to ensure a safe trip."
      lastUpdated="February 2026"
    >
      <h3>1. Driving Side</h3>
      <p>
        In the TRNC, traffic moves on the **LEFT** side of the road. Seatbelts are mandatory for all passengers, and the use of mobile phones while driving is strictly prohibited.
      </p>

      <h3>2. Speed Limits</h3>
      <p>
        Speed is monitored by fixed radar cameras across the island. General limits are:
      </p>
      <ul>
        <li>Urban areas: 50 km/h</li>
        <li>Open roads: 65 - 80 km/h</li>
        <li>Highways: 100 km/h</li>
      </ul>

      <h3>3. Alcohol Policy</h3>
      <p>
        The TRNC has a zero-tolerance policy for drink-driving. The legal limit is extremely low, and we strongly advise against any alcohol consumption if you plan to drive.
      </p>

      <h3>4. Border Crossings</h3>
      <p>
        Rental cars from the TRNC are **NOT permitted** to cross the "Green Line" into South Cyprus. This is due to insurance and legal restrictions. Crossing the border will void all insurance and may result in the impounding of the vehicle.
      </p>

      <h3>5. Parking</h3>
      <p>
        Avoid parking on double yellow lines or in front of "No Parking" signs. In Kyrenia and Nicosia, use designated "Pay & Display" parking areas to avoid fines.
      </p>
    </LegalPage>
  );
}
