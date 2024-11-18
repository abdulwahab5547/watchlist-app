"use client"

import { useState, useEffect } from 'react';
import Logo from '@/app/assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';

function Footer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Set to true if token exists
    }, []);

    return (
        <div className="bg-black border-t-[1px] border-lightGray border-opacity-40 text-white">
            <div className="px-5 max-w-[94%] m-auto py-10 pt-14">
                <div className="py-3 pb-10 flex items-center flex-col">
                    <div>
                        <Link href="/">
                            <div>
                                <Image src={Logo} alt="" width={190} />
                            </div>
                        </Link>
                    </div>
                    {!isAuthenticated && (
                        <div className="py-4">
                            <h3>
                                <a className="text-orange text-sm" href="/login">
                                    Sign in
                                </a>{' '}
                                for more features
                            </h3>
                        </div>
                    )}
                </div>
                <div className="flex justify-center py-3">
                    <ul className="flex md:flex-row flex-col text-center gap-5 text-sm">
                        <li>
                            <Link href="/"><p>Home</p></Link>
                        </li>
                        <li>
                            <a href="/tv-series">TV Series</a>
                        </li>
                        <li>
                            <a href="/watchlist">Watchlist</a>
                        </li>
                        <li>
                            <a href="/random-movie">Random movie</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Footer;