import { usePathname } from "next/navigation";

function NavLinks(){
    const currentPath = usePathname();
    return(
        <div className="items-center md:flex hidden">
            <ul className="flex gap-4 text-sm">
                <li>
                    <a
                        href="/"
                        className={
                            currentPath === "/"
                                ? "underline decoration-orange underline-offset-4"
                                : ""
                        }
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a
                        href="/tv-series"
                        className={
                            currentPath === "/tv-series"
                                ? "underline decoration-orange underline-offset-4"
                                : ""
                        }
                    >
                        TV Series
                    </a>
                </li>
                <li>
                    <a
                        href="/watchlist"
                        className={
                            currentPath === "/watchlist"
                                ? "underline decoration-orange underline-offset-4"
                                : ""
                        }
                    >
                        Watchlist
                    </a>
                </li>
                <li>
                    <a
                        href="/random-movie"
                        className={
                            currentPath === "/random-movie"
                                ? "underline decoration-orange underline-offset-4"
                                : ""
                        }
                    >
                        Random movie
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default NavLinks;