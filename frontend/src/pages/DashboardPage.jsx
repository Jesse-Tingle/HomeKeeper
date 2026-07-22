import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../styles/dashboard.css";

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

function DollarIcon() {
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
            <circle cx="12" cy="12" r="9" />
            <path d="M16 8.5c-.8-1-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.5s1.3 2.2 3.5 2.7c2.2.5 3.5 1.2 3.5 2.8s-1.5 2.7-3.8 2.7c-1.7 0-3.1-.6-4.2-1.7" />
            <path d="M12 5v14" />
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

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

function getAssetSymbol(asset) {
    const category = asset?.category?.toLowerCase() || "";
    const name = asset?.name?.toLowerCase() || "";

    if (
        category.includes("hvac") ||
        name.includes("air conditioner") ||
        name.includes("ac")
    ) {
        return "❄";
    }

    if (
        category.includes("plumb") ||
        name.includes("water") ||
        name.includes("heater")
    ) {
        return "◊";
    }

    if (
        category.includes("appliance") ||
        name.includes("dishwasher") ||
        name.includes("oven")
    ) {
        return "▦";
    }

    return "⌂";
}

export default function DashboardPage() {
    const [homes, setHomes] = useState([]);
    const [assets, setAssets] = useState([]);
    const [maintenanceEvents, setMaintenanceEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                setError("");

                const homesResponse = await apiClient.get("/homes");
                const homesData = getResponseData(homesResponse);

                const assetResponses = await Promise.all(
                    homesData.map(async (home) => {
                        const response = await apiClient.get(
                            `/homes/${home.id}/assets`,
                        );

                        return getResponseData(response).map((asset) => ({
                            ...asset,
                            home_id: asset.home_id || home.id,
                            home_name: home.name,
                        }));
                    }),
                );

                const allAssets = assetResponses.flat();

                const maintenanceResponses = await Promise.all(
                    allAssets.map(async (asset) => {
                        const response = await apiClient.get(
                            `/assets/${asset.id}/maintenance-events`,
                        );

                        return getResponseData(response).map((event) => ({
                            ...event,
                            asset_name: asset.name,
                            asset_id: asset.id,
                        }));
                    }),
                );

                if (!isMounted) {
                    return;
                }

                setHomes(homesData);
                setAssets(allAssets);
                setMaintenanceEvents(maintenanceResponses.flat());
            } catch (requestError) {
                console.error("Unable to load dashboard:", requestError);

                if (isMounted) {
                    setError(
                        requestError.message ||
                        "Unable to load your dashboard.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const totalAssetValue = useMemo(
        () =>
            assets.reduce(
                (total, asset) =>
                    total + Number(asset.purchase_cost || 0),
                0,
            ),
        [assets],
    );

    const recentAssets = useMemo(
        () =>
            [...assets]
                .sort((first, second) => {
                    const firstDate = new Date(
                        first.created_at || first.install_date || 0,
                    );

                    const secondDate = new Date(
                        second.created_at || second.install_date || 0,
                    );

                    return secondDate - firstDate;
                })
                .slice(0, 3),
        [assets],
    );

    const recentMaintenance = useMemo(
        () =>
            [...maintenanceEvents]
                .sort(
                    (first, second) =>
                        new Date(second.event_date || second.created_at || 0) -
                        new Date(first.event_date || first.created_at || 0),
                )
                .slice(0, 3),
        [maintenanceEvents],
    );

    if (isLoading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="dashboard-loading__spinner" />
                    <p>Loading your home summary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-heading">
                <div>
                    <p className="dashboard-heading__eyebrow">Overview</p>
                    <h1>Dashboard</h1>
                </div>

                <p className="dashboard-heading__summary">Home summary</p>
            </div>

            {error && (
                <div className="dashboard-error" role="alert">
                    {error}
                </div>
            )}

            <section
                className="dashboard-stats"
                id="homes"
                aria-label="Home summary statistics"
            >
                <article className="dashboard-stat dashboard-stat--homes">
                    <div className="dashboard-stat__icon">
                        <HomeIcon />
                    </div>

                    <div>
                        <span>Homes</span>
                        <strong>{homes.length}</strong>
                    </div>
                </article>

                <article className="dashboard-stat dashboard-stat--assets">
                    <div className="dashboard-stat__icon">
                        <ToolsIcon />
                    </div>

                    <div>
                        <span>Assets</span>
                        <strong>{assets.length}</strong>
                    </div>
                </article>

                <article className="dashboard-stat dashboard-stat--maintenance">
                    <div className="dashboard-stat__icon">
                        <CalendarIcon />
                    </div>

                    <div>
                        <span>Maintenance</span>
                        <strong>{maintenanceEvents.length}</strong>
                    </div>
                </article>

                <article className="dashboard-stat dashboard-stat--value">
                    <div className="dashboard-stat__icon">
                        <DollarIcon />
                    </div>

                    <div>
                        <span>Total Value</span>
                        <strong>{formatCurrency(totalAssetValue)}</strong>
                    </div>
                </article>
            </section>

            <div className="dashboard-panels">
                <section
                    className="dashboard-panel"
                    id="recent-assets"
                    aria-labelledby="recent-assets-title"
                >
                    <div className="dashboard-panel__header">
                        <h2 id="recent-assets-title">Recent Assets</h2>

                        {assets.length > 3 && (
                            <a href="#homes">View all</a>
                        )}
                    </div>

                    {recentAssets.length === 0 ? (
                        <div className="dashboard-panel__empty">
                            <p>No assets have been added yet.</p>
                            <p>Add an asset from one of your home pages.</p>
                        </div>
                    ) : (
                        <div className="dashboard-list">
                            {recentAssets.map((asset) => (
                                <Link
                                    className="dashboard-list__item"
                                    key={asset.id}
                                    to={`/assets/${asset.id}`}
                                >
                                    <span className="dashboard-list__icon">
                                        {getAssetSymbol(asset)}
                                    </span>

                                    <span className="dashboard-list__content">
                                        <strong>{asset.name}</strong>

                                        <span>
                                            {asset.location ||
                                                asset.home_name ||
                                                "Location not specified"}
                                        </span>
                                    </span>

                                    <span className="dashboard-list__chevron">
                                        <ChevronIcon />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section
                    className="dashboard-panel"
                    id="maintenance-history"
                    aria-labelledby="maintenance-history-title"
                >
                    <div className="dashboard-panel__header">
                        <h2 id="maintenance-history-title">
                            Maintenance History
                        </h2>

                        {maintenanceEvents.length > 3 && (
                            <a href="#maintenance-history">View all</a>
                        )}
                    </div>

                    {recentMaintenance.length === 0 ? (
                        <div className="dashboard-panel__empty">
                            <p>No maintenance events recorded yet.</p>
                            <p>
                                Open an asset to add its first maintenance
                                record.
                            </p>
                        </div>
                    ) : (
                        <div className="dashboard-list">
                            {recentMaintenance.map((event) => (
                                <Link
                                    className="dashboard-list__item"
                                    key={event.id}
                                    to={`/assets/${event.asset_id}`}
                                >
                                    <span className="dashboard-list__icon">
                                        <CalendarIcon />
                                    </span>

                                    <span className="dashboard-list__content">
                                        <strong>{event.event_type}</strong>
                                        <span>{event.asset_name}</span>
                                    </span>

                                    <span className="dashboard-list__status">
                                        Complete
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}