function SkeletonPortrait() {
    return (
      <div className="w-full max-w-[150px] md:max-w-[150px] py-2">
        <div className="h-[180px] bg-black rounded-xl shadow-xl px-1 animate-pulse">
          <div className="h-[100px] bg-gray-700 rounded-t-xl mb-3"></div>
          <div className="px-2 py-2">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }
  
  export default SkeletonPortrait;  