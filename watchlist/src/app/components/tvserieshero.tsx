"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import toast from 'react-hot-toast';

interface TVShow {
  title: string;
  first_aired: string;
  overview: string;
  genres?: string[];
  poster_path: string;
  _id: number;
  contentType: string;
}

interface Movie {
  title: string;
  first_aired: string;
  overview: string;
  genres?: string[];
  poster_path: string;
  _id: number;
  contentType: string;
}

function HeroSection() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const apiKey: string = process.env.NEXT_PUBLIC_HOME_API_KEY as string;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const genreSections = [
    { title: "Drama Series", genre: "Drama" },
    { title: "Crime TV Shows", genre: "Crime" },
    { title: "Mystery Shows", genre: "Mystery" },
    { title: "Comedy Shows", genre: "Comedy" },
    { title: "Animated TV Shows", genre: "Animation" },
    { title: "Family Shows", genre: "Family" },
    { title: "Action & Adventure Shows", genre: "Action & Adventure" },
  ];

  useEffect(() => {
    const fetchMoviesAndTVShows = async () => {
      try {
        const response = await fetch("https://movies-api14.p.rapidapi.com/shows", {
          method: "GET",
          headers: {
            "x-rapidapi-key": "8211cb3157msh1b2d13eb9aacc9ap19cf84jsnaf815c61ccd7",
            "x-rapidapi-host": "movies-api14.p.rapidapi.com",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setTvShows(data.movies); // Assuming the 'movies' field contains TV shows
        setMovies(data.movies); // Assuming the 'movies' field contains movies
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAndTVShows();
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
          release_date: movie.first_aired,
          overview: movie.overview,
          poster_path: movie.poster_path,
          genre: movie.genres,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString(); // Return null if invalid date
  };

  const filterMoviesByGenre = (genre: string) => {
    return movies.filter((movie) => movie.genres?.includes(genre));
  };

  if (loading) return <div className="max-w-[94%] m-auto px-4 py-24 text-white">Loading...</div>;
  if (error) return <div className="max-w-[94%] m-auto px-4 py-24 text-white">Error: {error}</div>;

  return (
    <div className="max-w-[94%] m-auto pb-24 px-4 text-white">
      {/* Featured TV Shows Section */}
      <div className="py-5">
        <div className="pt-10 pb-5">
          <h2 className="font-bold text-lg">Featured TV Shows</h2>
        </div>

        <div className="grid md:grid-cols-8 grid-cols-2 gap-3 relative">
          {tvShows.slice(0, 24).map((show) => (
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
                  <Link href={`/series-details/${show._id}`}>
                    <p className="text font-bold text-sm">{show.title}</p>
                  </Link>

                  {formatDate(show.first_aired) && (
                    <p className="text-sm flex items-center pt-4 text-xs">
                      <i className="fa-solid fa-calendar text-orange pr-1"></i>
                      {formatDate(show.first_aired)}
                    </p>
                  )}

                  <div className="pt-6">
                    <Link href={`/series-details/${show._id}`}>
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
                    onClick={() => handleBookmarkClick(show)}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Sections */}
      {genreSections.map((section) => {
        const filteredMovies = filterMoviesByGenre(section.genre);
        return filteredMovies.length > 0 ? (
          <div key={section.genre} className="py-5">
            <div className="pt-10 pb-5">
              <h2 className="font-bold text-lg">{section.title}</h2>
            </div>

            <div className="grid md:grid-cols-8 grid-cols-3 gap-3 relative">
              {filteredMovies.slice(0, 24).map((movie) => (
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
                      <Link href={`/series-details/${movie._id}`}>
                        <p className="text font-bold text-sm">{movie.title}</p>
                      </Link>

                      {formatDate(movie.first_aired) && (
                        <p className="text-sm flex items-center pt-4 text-xs">
                          <i className="fa-solid fa-calendar text-orange pr-1"></i>
                          {formatDate(movie.first_aired)}
                        </p>
                      )}

                      <div className="pt-6">
                        <Link href={`/series-details/${movie._id}`}>
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
              ))}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
}

export default HeroSection;