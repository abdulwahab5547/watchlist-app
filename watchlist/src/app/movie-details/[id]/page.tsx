"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Source {
    source: string;
    link: string;
    type?: string;
    display_name?: string;
    info?: string;
    logo_url?: string;
    platform?: Record<string, any>;
}

interface SimilarMovie {
    _id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    backdrop_path?: string;
}

interface Movie {
    title?: string;
    release_date?: string;
    overview?: string;
    genres?: string[];
    vote_average?: string;
    youtube_trailer?: string;
    _id: number;
    backdrop_path: string;
    poster_path: string;
    sources?: Source[];
}

function Info() {
    const pathname = usePathname();
    const id = pathname?.split("/").pop();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    console.log(loading);

    // const apiKey: string = process.env.NEXT_PUBLIC_HOME_API_KEY as string;

    useEffect(() => {
        if (!id) return;

        const fetchMovie = async () => {
            try {
                const response = await fetch(`https://movies-api14.p.rapidapi.com/movie/${id}`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": "8211cb3157msh1b2d13eb9aacc9ap19cf84jsnaf815c61ccd7",
                        "x-rapidapi-host": "movies-api14.p.rapidapi.com",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();
                setMovie(data.movie);
                setSimilarMovies(data.similarMovies || []);
                console.log(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    return (
        <div>
            <div className="max-w-[94%] m-auto text-white pb-20">
                <div className="py-5 px-5 pt-12">
                    {error && <p>Error: {error}</p>}
                    {movie && (
                        <div className="max-w-[950px]">
                            <div className="pb-5">
                                <Link href="/" className="text-xs hover:text-orange hover:cursor-pointer">
                                    <span>
                                        <i className="fa-solid fa-arrow-left pr-2"></i>
                                    </span>
                                    Go to homepage
                                </Link>
                            </div>
                            <div>
                                {/* Movie title and release date etc */}
                                <h3 className="md:text-4xl text-2xl font-bold">{movie.title}</h3>
                                <div className="flex gap-4 pt-3 pb-3">
                                    <span className="text-lightGray">
                                        <i className="fa-solid fa-star text-orange pr-1"></i>
                                        {movie.vote_average}
                                    </span>
                                </div>

                                {/* YouTube trailer */}
                                <div className="py-3">
                                    <iframe
                                        className="w-full h-[500px]" 
                                        src={movie.youtube_trailer?.replace("watch?v=", "embed/")}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                
                                {/* Release date */}
                                <div className="pt-2">
                                    <span className="text-lightGray"><span className="font-bold">Release date:</span> {movie.release_date}</span>
                                </div>

                                {/* Movie overview */}
                                <p className="text-lg py-6">{movie.overview}</p>

                                {/* Movie images */}
                                <div className="flex py-8 gap-3">
                                    <Image
                                        src={movie.poster_path}
                                        alt="movie poster"
                                        width={300}
                                        height={600}
                                        className="img-fluid min-w-[150px] h-auto"
                                    />
                                    <Image
                                        src={movie.backdrop_path}
                                        alt="movie backdrop"
                                        width={800}
                                        height={600}
                                        className="img-fluid min-w-[150px] h-auto"
                                    />
                                </div>
                            </div>

                            {/* Sources */}
                            <div className="py-8">
                                <h4 className="text-xl">Sources</h4>
                                <div className="flex gap-3 pt-2 flex-wrap">
                                    {movie?.sources?.map((source, index) => (
                                        <div key={index} className="bg-black px-3 py-2 rounded-lg flex items-center gap-3">
                                            <a 
                                                href={source.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-white hover:underline"
                                            >
                                                {source.display_name || 'View Source'}
                                            </a>
                                        </div>
                                    ))}
                                    {!movie?.sources?.length && <p className="text-gray-400">No sources available.</p>}
                                </div>
                            </div>

                            {/* Similar movies */}
                            <div className="py-8">
                                <h4 className="text-xl">Similar Movies</h4>
                                <div className="pt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {similarMovies.length > 0 ? (
                                        similarMovies.slice(0, 10).map((similarMovie) => (
                                            <div
                                                key={similarMovie._id}
                                                className="relative rounded-lg group transition-transform duration-300 hover:scale-110"
                                            >
                                                <Image
                                                    src={similarMovie.poster_path}
                                                    alt="movie poster"
                                                    width={300}
                                                    height={450}
                                                    className="img-fluid rounded-lg transition-opacity duration-300 group-hover:opacity-30"
                                                />
                                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    
                                                    {/* Similar movie info div */}
                                                    <div className="px-6">
                                                        <Link href={`/movie-details/${similarMovie._id}`}>
                                                            <p className="text hover:text-lightGray font-bold">{similarMovie.title}</p>
                                                        </Link>
                                                        {similarMovie.release_date && (
                                                            <p className="text-sm flex items-center pt-4">
                                                                <i className="fa-solid fa-calendar text-orange pr-1"></i>
                                                                {new Date(similarMovie.release_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                        <div className="pt-6">
                                                            <Link href={`/movie-details/${similarMovie._id}`}>
                                                                <div className="hover:text-orange">
                                                                    View Info
                                                                    <i className="pl-2 fa-solid fa-circle-info"></i>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No similar movies available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Info;