import { Link } from "react-router-dom";

export default function HomeSummaryCard({ home, editPath }) {
    if (!home) {
        return null;
    }

    const address = [
        home.street_address,
        home.city,
        home.state,
        home.postal_code,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <article className="home-summary">
            <div className="home-summary__header">
                <div className="home-summary__identity">
                    <div className="home-summary__icon" aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 11.5 12 4l9 7.5" />
                            <path d="M5.5 10.5V20h13v-9.5" />
                            <path d="M9.5 20v-6h5v6" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="home-summary__title">{home.name}</h1>

                        <p className="home-summary__address">
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

                            <span>{address || "Address not specified"}</span>
                        </p>
                    </div>
                </div>

                {editPath && (
                    <Link
                        className="btn btn--secondary home-summary__edit"
                        to={editPath}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                        </svg>

                        Edit Home
                    </Link>
                )}
            </div>

            <div className="home-summary__body">
                <section className="home-summary__details">
                    <h2 className="home-summary__section-title">
                        Home Details
                    </h2>

                    <div className="home-summary__detail">
                        <div
                            className="home-summary__detail-icon"
                            aria-hidden="true"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="4" y="3" width="10" height="18" rx="1" />
                                <path d="M8 7h2M8 11h2M8 15h2" />
                                <path d="M14 9h6v12h-6" />
                                <path d="M17 13h1M17 17h1" />
                            </svg>
                        </div>

                        <div>
                            <span className="home-summary__detail-label">
                                Type
                            </span>

                            <p className="home-summary__detail-value">
                                {home.type || "Not specified"}
                            </p>
                        </div>
                    </div>
                </section>

                <aside className="home-summary__notice">
                    <div
                        className="home-summary__notice-icon"
                        aria-hidden="true"
                    >
                        i
                    </div>

                    <div>
                        <h2 className="home-summary__notice-title">
                            About this home
                        </h2>

                        <p className="home-summary__notice-text">
                            View and manage this home&apos;s assets and
                            maintenance history.
                        </p>
                    </div>
                </aside>
            </div>
        </article>
    );
}