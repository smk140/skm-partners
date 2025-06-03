export default function AdminLogsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div>
                    <div className="h-6 bg-slate-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-64 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
