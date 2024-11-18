import Image from "next/image";
import SeriesBackground from "@/app/assets/seriesbg.jpeg";

function TVSeriesTop() {
  return (
    <div className="max-w-[94%] mx-auto h-[60vh] pt-10">
      <div className="px-4 h-full">
        <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg bg-black">
          {/* Fluid Background Image */}
          <Image
            className="opacity-30"
            src={SeriesBackground}
            alt="Poster Background"
            layout="fill"
            
            objectFit="cover"
            objectPosition="center"
            priority
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center px-4 max-w-[800px]">
              <h1 className="text-2xl md:text-6xl font-bold mb-6">
                Find your next obsession on this page. 
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVSeriesTop;