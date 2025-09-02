export default function MilestoneLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center space-x-1 mb-4">
            <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
          </div>

          {/* Navigation skeleton */}
          <div className="border-b border-border mb-6">
            <div className="flex space-x-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2 py-4 px-1">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
