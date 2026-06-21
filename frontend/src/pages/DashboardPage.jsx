import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [homes, setHomes] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [homeForm, setHomeForm] = useState({
        name: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "USA",
        type: ""
    });

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

    const handleHomeChange = (event) => {
        const { name, value } = event.target;

        setHomeForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCreateHome = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                name: homeForm.name,
                street_address: homeForm.street_address,
                city: homeForm.city,
                state: homeForm.state,
                postal_code: homeForm.postal_code,
                country: homeForm.country || undefined,
                type: homeForm.type || undefined
            };

            const newHome = await apiClient.post("/homes", payload);

            setHomes((prevHomes) => [newHome, ...prevHomes]);

            setHomeForm({
                name: "",
                street_address: "",
                city: "",
                state: "",
                postal_code: "",
                country: "USA",
                type: ""
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                <h2>Create Home</h2>

                <form onSubmit={handleCreateHome}>
                    <div>
                        <label htmlFor="name">Home Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={homeForm.name}
                            onChange={handleHomeChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="street_address">Street Address</label>
                        <input
                            id="street_address"
                            name="street_address"
                            type="text"
                            value={homeForm.street_address}
                            onChange={handleHomeChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={homeForm.city}
                            onChange={handleHomeChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="state">State</label>
                        <input
                            id="state"
                            name="state"
                            type="text"
                            value={homeForm.state}
                            onChange={handleHomeChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="postal_code">Postal Code</label>
                        <input
                            id="postal_code"
                            name="postal_code"
                            type="text"
                            value={homeForm.postal_code}
                            onChange={handleHomeChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="country">Country</label>
                        <input
                            id="country"
                            name="country"
                            type="text"
                            value={homeForm.country}
                            onChange={handleHomeChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="type">Home Type</label>
                        <input
                            id="type"
                            name="type"
                            type="text"
                            value={homeForm.type}
                            onChange={handleHomeChange}
                            placeholder="Primary, Vacation, Rental..."
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Home"}
                    </button>
                </form>
            </section>

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
                                    {home.street_address}, {home.city}, {home.state} {home.postal_code}
                                </p>
                                <p>Type: {home.type || "Not specified"}</p>
                                {home.role && <p>Role: {home.role}</p>}

                                <Link to={`/homes/${home.id}`}>View Details</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}