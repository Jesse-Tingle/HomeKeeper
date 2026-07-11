import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <header>
                <Link to="/">
                    <strong>Home Maintenance Tracker</strong>
                </Link>

                <nav>
                    <Link to="/">Dashboard</Link>

                    {user && <span>Signed in as {user.name}</span>}

                    <button type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>

            <Outlet />
        </div>
    );
}