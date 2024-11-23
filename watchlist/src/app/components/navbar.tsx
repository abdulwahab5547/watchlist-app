"use client";

import { useUser } from "@/app/context/usercontext"
import { useEffect, useState } from "react";
import Logo from "@/app/assets/logo.png";
import Image from "next/image";
import ProfileOverlay from "./profileoverlay";
import NavLinks from "./navlinks";
import NavOpenLinks from "./navopenlinks";
import SearchOverlay from "./searchoverlay";
import Link from "next/link";

// Dynamically import avatar images based on selectedAvatar
const avatarImports = {
    1: require('@/app/assets/avatars/1.svg'),
    2: require('@/app/assets/avatars/2.svg'),
    3: require('@/app/assets/avatars/3.svg'),
    4: require('@/app/assets/avatars/4.svg'),
    5: require('@/app/assets/avatars/5.svg'),
    6: require('@/app/assets/avatars/6.svg'),
    7: require('@/app/assets/avatars/7.svg'),
    8: require('@/app/assets/avatars/8.svg'),
};

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
    const { selectedAvatar, setSelectedAvatar } = useUser();
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

    // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }
    
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
    
                const data = await response.json();
                const { avatar } = data; 
                setSelectedAvatar(avatar);
                console.log(avatar);
            } catch (error) {
                console.error("Error fetching user avatar:", error);
            }
        };
    
        fetchUserAvatar();
    }, [setSelectedAvatar]); // Dependency on setSelectedAvatar ensures it only runs once on mount    

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleProfileOverlay = () => {
        setIsProfileOverlayOpen((prev) => !prev);
    };

    const toggleSearchOverlay = () => {
        setIsSearchOverlayOpen((prev) => !prev);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);
    // Determine which avatar to display based on selectedAvatar
    const AvatarComponent = selectedAvatar ? avatarImports[selectedAvatar as keyof typeof avatarImports] : null;

    return (
        <div className="h-[60px] bg-black border-b-[1px] border-lightGray border-opacity-40 text-white">
            <div className="h-full flex justify-between items-center max-w-[94%] m-auto pr-5">
                <div className="flex gap-4">
                    <div>
                        <Link href="/">
                                <Image src={Logo} alt="" width={190} />
                        </Link>
                    </div>
                    <NavLinks/>
                </div>

                <div className="text-sm flex gap-5 items-center">
                    <div className="hidden md:block">
                        <input
                            placeholder="Search"
                            className="pl-3 border-white border-2 focus:outline-orange rounded bg-inherit"
                            onClick={toggleSearchOverlay}
                        />
                    </div>
                    <div className="md:hidden" onClick={toggleSearchOverlay}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="md:hidden" onClick={toggleMenu}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <div>
                        {isAuthenticated ? (
                            <div
                                className="w-[35px] h-[35px] flex items-center justify-center cursor-pointer"
                                onClick={toggleProfileOverlay}
                            >
                                {AvatarComponent ? (
                                    <Image src={AvatarComponent} alt="User Avatar" width={35} height={35} />
                                ) : (
                                    <i className="fa-solid fa-user"></i>
                                )}
                            </div>
                        ) : (
                            <a
                                href="/login"
                                className="hover:cursor-pointer bg-red-500 hover:bg-red-600 rounded-full py-1 md:py-2 px-2 md:px-4"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Full-screen Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                    <div className="bg-lessBlack text-white p-8 w-full max-w-md relative">
                        <NavOpenLinks closeMenu={closeMenu}/>
                        <div
                            className="absolute top-5 right-5"
                            onClick={closeMenu}
                        >
                            <i className="fa-solid fa-x"></i>
                        </div>
                    </div>
                </div>
            )}

            

            {/* Profile Overlay */}
            <ProfileOverlay
                isVisible={isProfileOverlayOpen}
                onClose={toggleProfileOverlay}
            />

            {isSearchOverlayOpen && (
                <SearchOverlay toggleSearchOverlay={toggleSearchOverlay}/>              
            )}
        </div>
    );
}

export default Navbar;