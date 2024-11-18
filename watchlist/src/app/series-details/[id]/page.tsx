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

interface Show {
    title?: string;
    first_aired?: string;
    overview?: string;
    genres?: string[];
    vote_average?: number;
    youtube_trailer?: string;
    _id: number;
    backdrop_path: string;
    poster_path: string;
    sources?: Source[];
    seasons?: { season: number; episodes: any[] }[];
}

function Info() {
    const pathname = usePathname();
    const id = pathname?.split("/").pop();

    const [show, setShow] = useState<Show | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const apiKey: string = process.env.NEXT_PUBLIC_HOME_API_KEY as string;

    useEffect(() => {
        if (!id) return;

        const fetchShow = async () => {
            try {
                const response = await fetch(`https://movies-api14.p.rapidapi.com/show/${id}`, {
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
                setShow(data.show);
                console.log(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShow();
    }, [id]);

    return (
        <div>
            <div className="max-w-[94%] m-auto text-white pb-20">
                <div className="py-5 px-5 pt-12">
                    {error && <p>Error: {error}</p>}
                    {show && (
                        <div className="max-w-[950px]">
                            <div className="pb-5">
                                <a href="/tv-series" className="text-xs hover:text-orange hover:cursor-pointer">
                                    <span>
                                        <i className="fa-solid fa-arrow-left pr-2"></i>
                                    </span>
                                    Go to TV series page
                                </a>
                            </div>
                            <div>
                                {/* Show title and release date etc */}
                                <h3 className="md:text-4xl text-2xl font-bold">{show.title}</h3>
                                <div className="flex gap-4 pt-3 pb-3">
                                    <span className="text-lightGray">
                                        <i className="fa-solid fa-star text-orange pr-1"></i>
                                        {show.vote_average}
                                    </span>
                                </div>

                                {/* YouTube trailer */}
                                <div className="py-3">
                                    <iframe
                                        className="w-full h-[500px]"
                                        src={show.youtube_trailer?.replace("watch?v=", "embed/")}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                {/* First aired date */}
                                <div className="pt-2">
                                    <span className="text-lightGray"><span className="font-bold">First aired:</span> {show.first_aired}</span>
                                </div>

                                {/* Show overview */}
                                <p className="text-lg py-6">{show.overview}</p>

                                {/* Show images */}
                                <div className="flex py-8 gap-3">
                                    <Image
                                        src={show.poster_path}
                                        alt="show poster"
                                        width={300}
                                        height={600}
                                        className="img-fluid min-w-[150px] h-auto"
                                    />
                                    <Image
                                        src={show.backdrop_path}
                                        alt="show backdrop"
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
                                    {show?.sources?.map((source, index) => (
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
                                    {!show?.sources?.length && <p className="text-gray-400">No sources available.</p>}
                                </div>
                            </div>

                            {/* Seasons */}
                            {/* <div className="py-8">
                                <h4 className="text-xl">Seasons</h4>
                                <div className="pt-4">
                                    {show?.seasons?.length ? (
                                        show.seasons.map((season, seasonIndex) => (
                                            <div key={seasonIndex} className="py-4">

                                                <h5 className="text-lg font-semibold">Season {season.season}</h5>

                                                <div className="pt-2">
                                                    {season.episodes.length ? (
                                                        season.episodes.map((episode, episodeIndex) => (
                                                            <div key={episodeIndex} className="bg-gray-800 p-4 rounded-lg mb-4">

                                                                <h6 className="text-md font-semibold">{episode.title}</h6>

                                                                <span className="text-lightGray">
                                                                    <i className="fa-solid fa-calendar pr-2"></i>
                                                                    {episode.first_aired}
                                                                </span>
                                                                <div className="pt-2">

                                                                    {episode.thumbnail_path && (
                                                                        <Image
                                                                            src={episode.thumbnail_path}
                                                                            alt={`Thumbnail for ${episode.title}`}
                                                                            width={200}
                                                                            height={150}
                                                                            className="img-fluid w-full"
                                                                        />
                                                                    )}
                                                                </div>
                                                                {episode.sources?.length ? (
                                                                    <div className="pt-2">
                                                                        <h6 className="text-sm font-medium">Sources:</h6>
                                                                        {episode.sources.map((source: {
                                                                            display_name: string; link: string
                                                                        }, index: number) => (
                                                                            <div key={index} className="bg-black px-3 py-2 rounded-lg flex items-center gap-3 mb-2">
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
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-gray-400">No sources available for this episode.</p>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-400">No episodes available for this season.</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No seasons available for this show.</p>
                                    )}
                                </div>
                            </div> */}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Info;