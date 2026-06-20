import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [homes, setHomes] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomes = async () => {
            try {
                const data = await apiClient.get("/homes");
                setHomes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomes();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <main>
            <header>
                <h1>Dashboard</h1>

                {user && <p>Welcome, {user.name}</p>}

                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <section>
                <h2>My Homes</h2>

                {isLoading && <p>Loading homes...</p>}

                {error && <p>{error}</p>}

                {!isLoading && !error && homes.length === 0 && (
                    <p>You do not have any homes yet.</p>
                )}

                {homes.length > 0 && (
                    <ul>
                        {homes.map((home) => (
                            <li key={home.id}>
                                <h3>{home.name}</h3>
                                <p>
                                    {home.street_address}, {home.city}, {home.state}{" "}
                                    {home.postal_code}
                                </p>
                                <p>Type: {home.type || "Not specified"}</p>
                                <p>Role: {home.role}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}