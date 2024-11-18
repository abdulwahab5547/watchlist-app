"use client"

function SkeletonPortrait() {
    return (
        <div className="w-full pb-3 relative">
            {/* Grid for 8 cards in a row (3 on small devices) */}
            <div className="grid grid-cols-3 sm:grid-cols-8 gap-3">
                {/* 8 Portrait Skeletons */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="skeleton-portrait w-full h-[300px] bg-gray-700 rounded-lg animate-pulse">
                        {/* Image Skeleton */}
                        <div className="h-[200px] bg-gray-600 rounded-t-lg mb-3"></div>

                        {/* Text Skeletons */}
                        <div className="px-4 py-2">
                            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonPortrait;