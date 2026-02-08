export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Skeleton similar to FleetPage layout */}
      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-12 animate-pulse">
            <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              <div className="h-64 bg-[var(--surface-light)] rounded-xl border border-[var(--border)] animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="lg:col-span-3">
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="aspect-[4/3] bg-[var(--surface-light)] rounded-xl border border-[var(--border)] animate-pulse"></div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
