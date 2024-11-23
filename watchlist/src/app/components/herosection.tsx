"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from 'react-hot-toast';
import SkeletonRow from "./skeletonrow";

interface Movie {
  title: string;
  release_date: string;
  overview: string;
  genre?: string[];
  poster_path: string;
  _id: number;
  contentType: string; 
}

interface Section {
  title: string;
  movies: Movie[];
}

function HeroSection() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const apiKey: string = process.env.NEXT_PUBLIC_HOME_API_KEY as string;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Backend URL from env file

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("https://movies-api14.p.rapidapi.com/home", {
          method: "GET",
          headers: {
            "x-rapidapi-key": "8211cb3157msh1b2d13eb9aacc9ap19cf84jsnaf815c61ccd7",
            "x-rapidapi-host": "movies-api14.p.rapidapi.com",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data: Section[] = await response.json();
        setSections(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSections();
  }, []);

  

  const handleBookmarkClick = async (movie: Movie) => {
    try {
      const token = localStorage.getItem("token"); 
      console.log(token)
      if (!token) {
        toast("Please log in to save to your watchlist.");
        return;
      }

      const response = await fetch(`${backendUrl}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: movie._id,
          contentType: movie.contentType,
          title: movie.title,
          release_date: movie.release_date,
          overview: movie.overview,
          poster_path: movie.poster_path,
          genre: movie.genre,
        }),
      });

      if (!response.ok) {
        toast.error('Error adding to watchlist!');
        return;
      }

      toast.success(`${movie.title} added to your watchlist!`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error('Error adding to watchlist!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString(); // Return null if invalid date
  };

  if (loading) return <div className="max-w-[94%] m-auto px-4 py-24">
    <div>
      <SkeletonRow/>
      <SkeletonRow/>
      <SkeletonRow/>
    </div>
    
  </div>;
  if (error) return <div className="max-w-[94%] m-auto px-4 py-24">Error: {error}</div>;

  return (
    <div className="max-w-[94%] m-auto pb-24 px-4">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="py-5">
          {/* Section Title */}
          <div className="pt-10 pb-5">
            <h2 className="font-bold text-lg">{section.title}</h2>
          </div>

          {/* Movie Grid */}
          <div className="grid md:grid-cols-8 grid-cols-2 gap-3 relative">
            {section.movies.slice(0, 24).map((movie) => (
              <div key={movie._id}>
                <Link href={`/movie-details/${movie._id}`} className="block md:hidden">
                  <div
                    className="relative rounded-lg group transition-transform duration-300 hover:scale-110"
                  >
                    <Image
                      src={movie.poster_path}
                      alt="movie poster"
                      width={300}
                      height={450}
                      className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                    />
                  </div>
                </Link>
                <div className="hidden md:block relative rounded-lg group transition-transform duration-300 hover:scale-110">
                  <Image
                    src={movie.poster_path}
                    alt="movie poster"
                    width={300}
                    height={450}
                    className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6">
                      <Link href={`/movie-details/${movie._id}`}>
                        <p className="text font-bold text-sm">{movie.title}</p>
                      </Link>

                      {/* Display Date Only If Valid */}
                      {formatDate(movie.release_date) && (
                        <p className="text-sm flex items-center pt-4 text-xs">
                          <i className="fa-solid fa-calendar text-orange pr-1"></i>
                          {formatDate(movie.release_date)}
                        </p>
                      )}

                      <div className="pt-6">
                        <Link href={`/movie-details/${movie._id}`}>
                          <div className="hover:text-orange text-sm">
                            View Info
                            <i className="pl-2 fa-solid fa-circle-info"></i>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <i
                        className="fa-regular fa-bookmark text-lightGray hover:text-white text-sm hover:cursor-pointer"
                        onClick={() => handleBookmarkClick(movie)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroSection;