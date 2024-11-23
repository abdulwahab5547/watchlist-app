import Image from "next/image";
import PosterBackground from "@/app/assets/poster-bg3.jpg";
import Link from "next/link";

function HomeTop() {
  return (
    <div className="max-w-[94%] mx-auto h-[75vh] pt-10">
      <div className="px-4 h-full">
        <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg bg-black">
          {/* Fluid Background Image */}
          <Image
            className="opacity-30"
            src={PosterBackground}
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
                One stop for your next movie adventure.
              </h1>
              <div className="pt-2 w-full flex justify-center">
                <Link href="/random-movie">
                  <p className="w-full min-w-[200px] md:min-w-[300px] px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Random Movie
                  </p>
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTop;