"use client"

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SkeletonLandscape from "../components/skeletonlandscape";

interface Movie {
    title: string;
    year: string;
    description: string;
    genre?: string[];
    image: string;
    rank: number;
    imdb_link: string;
    rating: string;
    id: string;
}

function WatchList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const apiKey: string = process.env.NEXT_PUBLIC_TOP100_API_KEY as string;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/', {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': apiKey,
                        'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setMovies(data);
                console.log(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMovies();
    }, [apiKey]);

    return (
        <div>
            <Navbar />
            <div className="max-w-[94%] m-auto text-white pb-24">
                <div className='py-5 px-6 '>
                    <div className="">
                        <div className="pt-10 pb-5">
                            <h2 className="font-bold text-lg">Top 100 Movies</h2>
                        </div>
                        {error && <p>Error: {error}</p>}
                    </div>

                    {loading ? (
                        <div>
                            <SkeletonLandscape />
                            <SkeletonLandscape />
                            <SkeletonLandscape />
                        </div>
                    ) : (movies && (
                        <div className="flex flex-wrap items-center justify-between gap-5 max-w-[850px]">
                            {movies.map((movie, index) => (
                                <div key={index} className="w-full pb-3 relative">
                                    <div className="flex items-center bg-black rounded-xl shadow-xl">
                                        <div>
                                            <Image src={movie.image} alt='landscape' width={150} height={300} className='img-fluid min-w-[150px] h-auto rounded-l-xl' />
                                        </div>
                                        <div className="px-5 py-3">
                                            <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center pb-2">
                                                <Link href={`/top-100/${movie.id}`}>
                                                    <p className="text-lg font-bold hover:text-lightGray hover:cursor-pointer">
                                                        {movie.rank}- {movie.title}
                                                    </p>
                                                </Link>
                                                <a className="text-sm hover:text-orange text-sm text-lightGray" href={movie.imdb_link}>View on IMBD <span><i className="fa-solid fa-arrow-up-right-from-square"></i></span></a>
                                            </div>

                                            <div className="flex gap-4 pb-3">
                                                <span className="text-xs text-lightGray">{movie.year}</span>
                                                <span className="text-xs text-lightGrey"><i className="fa-solid fa-star text-orange pr-1"></i>{movie.rating}</span>
                                            </div>
                                            <p className="text-sm">{movie.description}</p>
                                            <div className="pt-5">
                                                <p className="font-bold pb-2 text-sm">Genres</p>
                                                <div className="flex items-center gap-2">
                                                    {movie.genre?.map((genre, genreIndex) => (
                                                        <span key={genreIndex} className="border-[1px] border-lightGray hover:border-white hover:text-white rounded-full p-1 text-sm px-3 text-lightGray">
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-4 flex gap-5">
                                        <Link href={`/top-100/${movie.id}`}>
                                            <div className="text-lightGray hover:text-white hover:cursor-pointer">
                                                <i className="fa-solid fa-circle-info"></i>
                                            </div>
                                        </Link>

                                        <div className="text-lightGray hover:text-white hover:cursor-pointer">
                                            <i className="fa-regular fa-bookmark text-lg"></i>
                                        </div>


                                        {/* fa solid */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default WatchList;