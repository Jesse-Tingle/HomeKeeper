import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../styles/homes-page.css";

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

function LocationIcon() {
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
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function ChevronIcon() {
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
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function getResponseData(response) {
    return response?.data ?? response ?? [];
}

function formatAddress(home) {
    return [
        home.street_address,
        home.city,
        home.state,
        home.postal_code,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function HomesPage() {
    const [homes, setHomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadHomes = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await apiClient.get("/homes");
                const homesData = getResponseData(response);

                if (isMounted) {
                    setHomes(homesData);
                }
            } catch (requestError) {
                console.error("Unable to load homes:", requestError);

                if (isMounted) {
                    setError(
                        requestError.response?.data?.message ||
                        requestError.message ||
                        "Unable to load your homes.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadHomes();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="homes-page">
                <div className="homes-page__loading">
                    <div className="homes-page__spinner" />
                    <p>Loading your homes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homes-page">
            <header className="homes-page__header">
                <div>
                    <p className="homes-page__eyebrow">Your properties</p>
                    <h1>Homes</h1>

                    <p className="homes-page__description">
                        View and manage the homes connected to your account.
                    </p>
                </div>

                <Link
                    className="btn btn--primary"
                    to="/dashboard"
                >
                    Add Home
                </Link>
            </header>

            {error && (
                <div className="homes-page__error" role="alert">
                    {error}
                </div>
            )}

            {homes.length === 0 ? (
                <section className="homes-empty">
                    <div className="homes-empty__icon">
                        <HomeIcon />
                    </div>

                    <h2>No homes added yet</h2>

                    <p>
                        Add your first home to begin tracking assets,
                        repairs, and maintenance history.
                    </p>

                    <Link className="btn btn--primary" to="/dashboard">
                        Add Your First Home
                    </Link>
                </section>
            ) : (
                <section
                    className="homes-grid"
                    aria-label="Homes associated with your account"
                >
                    {homes.map((home) => {
                        const address = formatAddress(home);

                        return (
                            <Link
                                className="home-list-card"
                                key={home.id}
                                to={`/homes/${home.id}`}
                            >
                                <div className="home-list-card__icon">
                                    <HomeIcon />
                                </div>

                                <div className="home-list-card__content">
                                    <div className="home-list-card__heading">
                                        <h2>{home.name}</h2>

                                        {home.type && (
                                            <span className="home-list-card__badge">
                                                {home.type}
                                            </span>
                                        )}
                                    </div>

                                    <p className="home-list-card__address">
                                        <LocationIcon />
                                        <span>
                                            {address ||
                                                "Address not specified"}
                                        </span>
                                    </p>

                                    <p className="home-list-card__hint">
                                        View assets and maintenance history
                                    </p>
                                </div>

                                <span className="home-list-card__chevron">
                                    <ChevronIcon />
                                </span>
                            </Link>
                        );
                    })}
                </section>
            )}
        </div>
    );
}