export default function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
