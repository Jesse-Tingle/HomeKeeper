import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

function HomeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5.5 10.5V20h13v-9.5" />
            <path d="M9.5 20v-6h5v6" />
        </svg>
    );
}

function ToolsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a4.2 4.2 0 0 1 5.5-5.5l-3 3" />
            <path d="m15 15 6 6" />
            <path d="m17 13 4 4" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.1A1.7 1.7 0 0 0 3.6 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8 3.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2h4v.1A1.7 1.7 0 0 0 15 3.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8c.37.37.9.58 1.43.6H21v4h-.17A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const userName = user?.name?.trim() || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="app-shell">
            <aside className="app-sidebar">
                <Link
                    className="sidebar-brand"
                    to="/dashboard"
                    aria-label="HomeKeeper dashboard"
                >
                    <HomeIcon />

                    <span>
                        Home<span>Keeper</span>
                    </span>
                </Link>

                <nav
                    className="sidebar-nav"
                    aria-label="Main navigation"
                >
                    <NavLink
                        className={({ isActive }) =>
                            [
                                "sidebar-nav__link",
                                isActive
                                    ? "sidebar-nav__link--active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")
                        }
                        to="/dashboard"
                        end
                    >
                        <HomeIcon />
                        <span>Dashboard</span>
                    </NavLink>

                    <Link
                        className="sidebar-nav__link"
                        to="/homes"
                    >
                        <HomeIcon />
                        <span>Homes</span>
                    </Link>

                    <Link
                        className="sidebar-nav__link"
                        to="/dashboard#recent-assets"
                    >
                        <ToolsIcon />
                        <span>Assets</span>
                    </Link>

                    <Link
                        className="sidebar-nav__link"
                        to="/dashboard#maintenance-history"
                    >
                        <CalendarIcon />
                        <span>Maintenance</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-nav__link sidebar-nav__button"
                        type="button"
                        onClick={() => navigate("/settings")}
                    >
                        <SettingsIcon />
                        <span>Settings</span>
                    </button>

                    <button
                        className="sidebar-nav__link sidebar-nav__button"
                        type="button"
                        onClick={handleLogout}
                    >
                        <LogoutIcon />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="app-topbar">
                    <button
                        className="user-menu"
                        type="button"
                        aria-label="Open user menu"
                    >
                        <span className="user-menu__welcome">
                            Welcome back, {userName}
                        </span>

                        <span className="user-menu__chevron">
                            <ChevronDownIcon />
                        </span>

                        <span
                            className="user-menu__avatar"
                            aria-hidden="true"
                        >
                            {userInitial}
                        </span>
                    </button>
                </header>

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}