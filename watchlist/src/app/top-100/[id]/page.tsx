"use client"

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Movie {
    title?: string;
    year?: string;
    description?: string;
    genre?: string[];
    image: string;
    rank?: number;
    imdb_link?: string;
    rating?: string;
    trailer_embed_link?: string;
    director?: string[];
    writers?: string[];
}

function Info() {
    const pathname = usePathname(); // Get the full pathname
    const id = pathname?.split('/').pop();  // Extract the dynamic part (id) from the pathname

    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const apiKey: string = process.env.NEXT_PUBLIC_TOP100_API_KEY as string;

    useEffect(() => {
        if (!id) return; 

        const fetchMovie = async () => {
            try {
                const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/${id}`, {
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
                setMovie(data);  
                console.log(data);
            } catch (err: any) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);  

    return (
        <div>
            <Navbar />
            <div className="max-w-[94%] m-auto text-white pb-20">
                <div className="py-5 px-5 pt-12">
                    {error && <p>Error: {error}</p>}
                    {movie && (
                        <div className="max-w-[950px]">
                            <div className="pb-5">
                                <a href="/top-100" className="text-xs hover:text-orange hover:cursor-pointer">
                                    <span><i className="fa-solid fa-arrow-left pr-2"></i></span>Back to top 100
                                </a>
                            </div>
                            <div>
                                <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center pb-2">
                                    {loading ? (
                                        <div className="h-10 w-3/4 bg-gray-700 animate-pulse rounded mb-2 md:mb-0 md:w-1/2"></div>
                                    ) : (
                                        <h3 className="md:text-4xl text-2xl font-bold">{movie.title}</h3>
                                    )}
                                    {loading ? (
                                        <div className="h-6 w-1/4 bg-gray-700 animate-pulse rounded"></div>
                                    ) : (
                                        <a
                                            className="text-sm hover:text-orange text-lightGray"
                                            href={movie.imdb_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on IMDb <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-3 pb-3">
                                    {loading ? (
                                        <>
                                            <div className="h-6 w-16 bg-gray-700 animate-pulse rounded"></div>
                                            <div className="h-6 w-16 bg-gray-700 animate-pulse rounded"></div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lightGray">{movie.year}</span>
                                            <span className="text-lightGray">
                                                <i className="fa-solid fa-star text-orange pr-1"></i>
                                                {movie.rating}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="w-full h-full relative overflow-hidden">
                                    {loading ? (
                                        <div className="w-full h-[500px] bg-gray-700 animate-pulse rounded"></div>
                                    ) : (
                                        <iframe
                                            className="w-full h-[500px]"
                                            src={movie.trailer_embed_link}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                            <div className="pt-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {movie.genre?.map((genre, index) => (
                                            <span key={index} className="border-[1px] border-lightGray hover:border-white hover:text-white rounded-full p-1 text px-3 text-lightGray">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-lightGray hover:text-white cursor-pointer">
                                        <i className="fa-regular fa-bookmark text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-7">
                                <p className="text-lg">{movie.description}</p>
                            </div>
                            <div className="flex pt-5">
                                <div>
                                    <Image src={movie.image} alt='movie-poster' width={300} height={600} className='img-fluid min-w-[150px] h-auto rounded-l-xl' />
                                </div>

                                <div className="px-5 py-3">
                                    <div>
                                        <h4 className="font-bold">Director</h4>
                                        <ul className="pt-3 pl-6 list-disc">
                                            {movie.director?.map((director, index) => (
                                                <li key={index} className="hover:text-white text-lightGray py-1">
                                                    {director}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-5">
                                        <h4 className="font-bold">Writers</h4>
                                        <ul className="pt-3 pl-6 list-disc">
                                            {movie.writers?.map((writer, index) => (
                                                <li key={index} className="hover:text-white text-lightGray py-1">
                                                    {writer}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Info;