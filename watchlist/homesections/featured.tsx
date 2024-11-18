"use client"

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Landscape from "@/app/assets/landscape.jpg"
import Portrait from "@/app/assets/portrait.jpg"

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

function Featured(){
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiKey: string = process.env.NEXT_PUBLIC_TOP100_API_KEY as string;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const randomRanks = Array.from({ length: 3 }, () => Math.floor(Math.random() * 100) + 1);
                const moviePromises = randomRanks.map(async (rank) => {
                    const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/top${rank}`, {
                        method: 'GET',
                        headers: {
                            'x-rapidapi-key': apiKey,
                            'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch');
                    }
                    return await response.json();
                });
                
                const movieData = await Promise.all(moviePromises);
                setMovies(movieData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className='py-5'>
            <div className="flex gap-5 w-full items-center">
                {/* Left part (70%) */}
                <div className="w-[70%]">
                    <div className="pt-10 pb-5">
                        <h2 className="font-bold text-lg">Featured</h2>
                    </div>
                    <div className="flex items-center justify-between gap-5 px-6 relative">
                        <div>
                            <Image src={Landscape} alt='landscape' className='w-full h-auto object-cover rounded-xl'/>
                        </div>
                        <div className='border-[1px] border-white absolute h-[80px] w-[35px] rounded-lg top-[31%] left-0 bg-black bg-opacity-50 flex items-center justify-center hover:text-orange hover:cursor-pointer shadow-xl'>
                            <i className="fa-solid fa-arrow-left text-xl"></i>
                        </div>
                        <div className='border-[1px] border-white absolute h-[80px] w-[35px] rounded-lg top-[31%] right-0 bg-black bg-opacity-50 flex items-center justify-center hover:text-orange hover:cursor-pointer shadow-xl'>
                            <i className="fa-solid fa-arrow-right text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* Right part (30%) */}
                <div className="w-[30%] md:pl-10">
                    <div className="pt-10 pb-5">
                        <h2 className="font-bold text-lg">3 Top Picks</h2>
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            movies.map((movie) => (
                                <div key={movie.id} className="bg-black w-[250px] flex gap-5 mb-4 rounded-xl my-1 relative">
                                    <div>
                                        <Image src={movie.image || Portrait} alt={movie.title} width={120} height={180} className='img-fluid rounded-l-xl'/>
                                    </div>
                                    <div className="px-5 py-3">
                                        <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center pb-2">
                                            <Link href={`/top-100/${movie.id}`}>
                                                <p className="text-lg font-bold hover:text-lightGray hover:cursor-pointer">
                                                    {movie.title}
                                                </p>
                                            </Link>
                                        </div>

                                        <div className="flex gap-4 pb-3">
                                            <span className="text-xs text-lightGray">{movie.year}</span>
                                            <span className="text-xs text-lightGrey"><i className="fa-solid fa-star text-orange pr-1"></i>{movie.rating}</span>
                                        </div>
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
                                    <div className="absolute top-5 right-5">
                                        <div className="text-lightGray hover:text-white hover:cursor-pointer">
                                            <i className="fa-regular fa-bookmark text-lg"></i>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Featured;