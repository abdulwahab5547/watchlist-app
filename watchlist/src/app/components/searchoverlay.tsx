"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchOverlayProps {
    toggleSearchOverlay: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ toggleSearchOverlay }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains("overlay")) {
            setIsVisible(false);
            setTimeout(() => toggleSearchOverlay(), 300);
        }
    };

    const fetchSearchResults = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://movies-api14.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": "8211cb3157msh1b2d13eb9aacc9ap19cf84jsnaf815c61ccd7",
                        "x-rapidapi-host": "movies-api14.p.rapidapi.com",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch search results");

            const data = await response.json();
            setResults(data.contents.slice(0, 16));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmarkClick = (movie: any) => {
        console.log(`Bookmark clicked for: ${movie.title}`);
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            } overlay`}
            onClick={handleOverlayClick}
        >
            <div className="bg-lessBlack text-white p-4 md:p-8 min-w-[94vw] min-h-[500px] max-w-md rounded-lg relative">
                <div className="md:max-w-[400px] max-w-[260px] m-auto flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") fetchSearchResults();
                        }}
                        className="pl-3 border-2 border-gray-400 text-black rounded w-full py-[3px]"
                    />
                    <button
                        onClick={fetchSearchResults}
                        className="p-1 w-[40px] bg-orange text-white rounded hover:bg-orange-dark"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                {loading && <p className="mt-4 text-center">Loading...</p>}
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                {results.length > 0 && (
                    <div
                        className="grid md:grid-cols-8 grid-cols-2 gap-3 relative mt-4 py-5 max-h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300"
                    >
                        {results.map((movie, index) => (
                            <div
                                key={movie._id || index}
                                className="relative rounded-lg group transition-transform duration-300 hover:scale-110"
                            >
                                <Image
                                    src={movie.poster_path || "/placeholder.png"}
                                    alt="movie poster"
                                    width={300}
                                    height={450}
                                    className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                                />

                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="px-6">
                                        <Link
                                            href={
                                                movie.contentType === "movie"
                                                    ? `/movie-details/${movie._id}`
                                                    : `/series-details/${movie._id}`
                                            }
                                        >
                                            <p className="text font-bold text-sm">{movie.title || "Untitled"}</p>
                                        </Link>
                                        {movie.release_date && (
                                            <p className="text-sm flex items-center pt-4 text-xs">
                                                <i className="fa-solid fa-calendar text-orange pr-1"></i>
                                                {movie.release_date}
                                            </p>
                                        )}
                                        <div className="pt-6">
                                            <Link
                                                href={
                                                    movie.contentType === "movie"
                                                        ? `/movie-details/${movie._id}`
                                                        : `/series-details/${movie._id}`
                                                }
                                            >
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
                )}

                <div
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => toggleSearchOverlay(), 300);
                    }}
                >
                    <i className="fa-solid fa-x text-sm md:text-md"></i>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;