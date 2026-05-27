// client/src/components/PageLoader.jsx
export function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-4 w-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800/80 rounded-xl p-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-1" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800/80 rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800/80 rounded-xl p-5">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
