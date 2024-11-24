"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SkeletonLandscape from "../components/skeletonlandscape";
import toast from 'react-hot-toast';

// Defining the Movie interface
interface Movie {
  title: string;
  release_date: string;
  overview: string;
  genre?: string[];
  poster_path: string;
  _id: number;
  contentType: string;
}

const RandomMovie: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Function to fetch a random trending movie
  const fetchTrendingMovie = async () => {
    try {
      const response = await fetch("https://movies-api14.p.rapidapi.com/home", {
        method: "GET",
        headers: {
          "x-rapidapi-key": "a8aca48308msh58e355dc5e8f267p1801b5jsn086f46900d32",
          "x-rapidapi-host": "movies-api14.p.rapidapi.com",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      const trendingMovies = data[0]?.movies; // Assuming Section 1 is the trending movies section

      if (!trendingMovies || trendingMovies.length === 0) {
        throw new Error("No movies found in trending section");
      }

      const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
      setMovie(randomMovie);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the random movie when the component mounts
  useEffect(() => {
    fetchTrendingMovie();
  }, []);

  // Function to fetch another random movie
  const fetchAnotherRandomMovie = () => {
    setLoading(true);
    setError(null);
    setMovie(null);
    fetchTrendingMovie(); // Re-run the fetch function
  };

  const handleBookmarkClick = async (movie: Movie) => {
    try {
      const token = localStorage.getItem("token"); 
      console.log(token)
      if (!token) {
        alert("Please log in to save to your watchlist.");
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
        // const errorData = await response.json();
        toast.error('Error adding to watchlist!');
        return;
      }

      toast.success(`${movie.title} added to your watchlist!`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error('Error adding to watchlist!');
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen text-white">
      <div className="flex-grow max-w-[94%] m-auto">
        <div className="py-16 max-w-[850px] px-10">
          <div className="text-center">
                <button
                    className="w-full max-w-[300px] px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={fetchAnotherRandomMovie}>
                
                    Random Movie
                </button>
          </div>
          <div className="pt-8">
            {error && <p>Error: {error}</p>}
            {loading ? (
              <SkeletonLandscape />
            ) : (
              movie && (
                <div className="w-full pb-3 relative">
                  <div className="flex md:flex-row flex-col justify-center md:items-center bg-black rounded-xl shadow-xl px-3 py-5">

                    {/* Left part of the card */}
                    <div className="px-4 flex justify-center md:block">
                      <Image
                        src={movie.poster_path}
                        alt="movie poster"
                        width={150}
                        height={300}
                        className="img-fluid min-w-[150px] h-auto rounded-l-xl"
                      />
                    </div>

                    {/* Right part of the card */}
                    <div className="pr-8 pl-3 py-12">
                      <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center pb-4">
                        <Link href={`/movie-details/${movie._id}`}>
                          <p className="text-lg font-bold hover:text-lightGray hover:cursor-pointer">
                            {movie.title}
                          </p>
                        </Link>
                        <p className="text-sm text-lightGray">
                          {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm">{movie.overview}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8 flex gap-5">
                    <Link href={`/movie-details/${movie._id}`}>
                      <div className="text-lightGray hover:text-white hover:cursor-pointer">
                        <i className="fa-solid fa-circle-info"></i>
                      </div>
                    </Link>

                    <div className="text-lightGray hover:text-white hover:cursor-pointer">
                      <i 
                        onClick={() => handleBookmarkClick(movie)} 
                        className="fa-regular fa-bookmark text-lg"
                        >
                        </i>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomMovie;