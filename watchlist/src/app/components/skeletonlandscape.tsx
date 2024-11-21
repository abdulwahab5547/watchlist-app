function SkeletonLandscape(){
    return(
        <div className="w-full pb-3 relative md:max-w-[780px] max-w-[300px] max-h-[300px]">
            <div className="flex md:min-w-[780px] max-w-[300px] max-h-[230px] items-center bg-black rounded-xl shadow-xl px-3 animate-pulse">
                <div className="h-[300px] w-full bg-gray-700 rounded-l-xl"></div>
                <div className="px-5 py-10 flex-1 w-full">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
                    <div className="flex gap-2 mt-3">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonLandscape; 