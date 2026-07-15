import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/layout.css";

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="app-header__inner">
                    <Link className="app-brand" to="/">
                        <span className="app-brand__icon">🏠</span>
                        <span>Home Maintenance Tracker</span>
                    </Link>

                    <nav className="app-nav">
                        <Link className="app-nav__link" to="/">
                            Dashboard
                        </Link>

                        {user && (
                            <span className="app-nav__user">
                                Signed in as {user.name}
                            </span>
                        )}

                        <button
                            className="app-nav__logout"
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <div className="app-content">
                <Outlet />
            </div>
        </div>
    );
}