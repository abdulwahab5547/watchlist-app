import { usePathname } from "next/navigation";

interface NavOpenLinksProps {
    closeMenu: () => void; 
}

const NavOpenLinks: React.FC<NavOpenLinksProps> = ({ closeMenu }) => {
    const currentPath = usePathname();
    return(
        <ul className="flex flex-col gap-4 text-lg">
            <li>
                <a
                    href="/"
                    onClick={closeMenu}
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
                    onClick={closeMenu}
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
                    onClick={closeMenu}
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
                    onClick={closeMenu}
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
    )
}

export default NavOpenLinks;