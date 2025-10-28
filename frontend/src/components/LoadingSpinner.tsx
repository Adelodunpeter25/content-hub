export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-blue-500 absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
