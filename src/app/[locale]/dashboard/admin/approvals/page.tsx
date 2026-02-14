import { getVehicles } from '@/lib/vehicleService';
import ApprovalsList from '@/components/dashboard/ApprovalsList';

export default async function ApprovalsPage() {
    // Fetch pending sale vehicles
    // We fetch limit 100 for now, could implement pagination later
    const { vehicles } = await getVehicles({ 
        type: 'sale', 
        status: 'pending',
        limit: 100 
    });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Pending Approvals</h1>
                    <p className="text-gray-500 font-medium">Review and approve customer vehicle listings.</p>
                </div>
            </div>

            <ApprovalsList initialVehicles={vehicles} />
        </div>
    );
}
