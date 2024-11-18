"use client"

import Image from "next/image";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useCallback, useEffect, useState } from "react";
import WatchlistTop from "../components/watchlisttop";

interface TVShow {
  title: string;
  first_aired: string;
  overview: string;
  genres?: string[];
  poster_path: string;
  _id: number;
  id: number;
  contentType: string;
}

interface Movie {
  title: string;
  first_aired: string;
  overview: string;
  genres?: string[];
  poster_path: string;
  _id: number;
  id: number;
  contentType: string;
}

interface Watchlist {
  movies: Movie[];
  tvShows: TVShow[];
}

function WatchList() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [watchlist, setWatchlist] = useState<Watchlist>({
    movies: [],
    tvShows: [],
  });

  const fetchWatchlist = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast("Please log in to view your watchlist.");
        return;
      }
  
      const response = await fetch(`${backendUrl}/api/watchlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching watchlist:", errorData.message);
        toast.error("Error fetching watchlist!");
        return;
      }
  
      const data = await response.json();
      console.log("Fetched watchlist:", data.watchlist);
  
      const movies = data.watchlist.filter((item: Movie | TVShow) => item.contentType === "movie");
      const tvShows = data.watchlist.filter((item: Movie | TVShow) => item.contentType === "show");
  
      setWatchlist({
        movies: movies as Movie[],
        tvShows: tvShows as TVShow[],
      });
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      toast.error("Error fetching watchlist!");
    }
  }, [backendUrl, setWatchlist]); // Add dependencies here
  
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString(); // Return null if invalid date
  };

  return (
    <div>
      <WatchlistTop/>
      <div className="max-w-[94%] m-auto text-white pb-16">
        <div className="py-5 px-4">

          {/* Movies Section */}
          <div className="py-5">
            <h3 className="font-bold md:text-lg pb-5">Movies</h3>
            <div className="grid md:grid-cols-8 grid-cols-3 gap-3 relative">
              {watchlist.movies.slice(0, 24).reverse().map((movie) => (
                <div
                  key={movie._id}
                  className="relative rounded-lg group transition-transform duration-300 hover:scale-110"
                >
                  <Image
                    src={movie.poster_path}
                    alt="Movie poster"
                    width={300}
                    height={450}
                    className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6">
                      <Link href={`/movie-details/${movie.id}`}>
                        <p className="text font-bold text-sm">{movie.title}</p>
                      </Link>

                      <div className="pt-6">
                        <Link href={`/movie-details/${movie.id}`}>
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
                        // onClick={() => handleBookmarkClick(movie)}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TV Shows Section */}
          <div className="py-5">
            <h3 className="font-bold md:text-lg pb-5">TV Shows</h3>
            <div className="grid md:grid-cols-8 grid-cols-3 gap-3 relative">
              {watchlist.tvShows.slice(0, 24).reverse().map((show) => (
                <div
                  key={show._id}
                  className="relative rounded-lg group transition-transform duration-300 hover:scale-110"
                >
                  <Image
                    src={show.poster_path}
                    alt="TV show poster"
                    width={300}
                    height={450}
                    className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6">
                      <Link href={`/series-details/${show.id}`}>
                        <p className="text font-bold text-sm">{show.title}</p>
                      </Link>

                      {show.first_aired && (
                        <p className="text-sm flex items-center pt-4 text-xs">
                          <i className="fa-solid fa-calendar text-orange pr-1"></i>
                          {formatDate(show.first_aired)}
                        </p>
                      )}

                      <div className="pt-6">
                        <Link href={`/series-details/${show.id}`}>
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
                        // onClick={() => handleBookmarkClick(show)}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WatchList;