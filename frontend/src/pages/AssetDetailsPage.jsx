import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/asset-details.css";

export default function AssetDetailsPage() {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [home, setHome] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [eventForm, setEventForm] = useState({
        event_type: "inspection",
        event_date: "",
        cost: "",
        notes: "",
    });

    useEffect(() => {
        let isMounted = true;

        const fetchAssetDetails = async () => {
            try {
                setIsLoading(true);
                setError("");

                const assetData = await apiClient.get(`/assets/${id}`);

                if (!assetData) {
                    throw new Error("Asset data was not returned.");
                }

                const eventData = await apiClient.get(
                    `/assets/${id}/maintenance-events`,
                );

                let homeData = null;

                if (assetData.home_id) {
                    homeData = await apiClient.get(
                        `/homes/${assetData.home_id}`,
                    );
                }

                if (!isMounted) {
                    return;
                }

                setAsset(assetData);
                setEvents(Array.isArray(eventData) ? eventData : []);
                setHome(homeData);
            } catch (requestError) {
                console.error(
                    "Unable to load asset details:",
                    requestError,
                );

                if (isMounted) {
                    setError(
                        requestError.message ||
                        "Unable to load asset details.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAssetDetails();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleEventChange = (event) => {
        const { name, value } = event.target;

        setEventForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleCreateEvent = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                asset_id: id,
                event_type: eventForm.event_type,
                event_date: eventForm.event_date,
                cost: eventForm.cost
                    ? Number(eventForm.cost)
                    : undefined,
                notes: eventForm.notes || undefined,
            };

            const newEvent = await apiClient.post(
                "/assets/maintenance-events",
                payload,
            );

            setEvents((previousEvents) => [
                newEvent,
                ...previousEvents,
            ]);

            setEventForm({
                event_type: "inspection",
                event_date: "",
                cost: "",
                notes: "",
            });
        } catch (requestError) {
            console.error(
                "Unable to create maintenance event:",
                requestError,
            );

            setError(
                requestError.message ||
                "Unable to add the maintenance event.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="asset-details-page">
                <p>Loading asset details...</p>
            </div>
        );
    }

    if (error && !asset) {
        return (
            <div className="asset-details-page">
                <p>{error}</p>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="asset-details-page">
                <p>Asset not found.</p>
            </div>
        );
    }

    return (
        <div className="asset-details-page">
            <Link
                className="asset-details-page__back"
                to={`/homes/${asset.home_id}`}
            >
                <span aria-hidden="true">←</span>
                Back to Home
            </Link>

            {error && (
                <div
                    className="asset-details-page__error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <section className="asset-overview">
                <div className="asset-overview__header">
                    <div className="asset-overview__identity">
                        <div
                            className="asset-overview__icon"
                            aria-hidden="true"
                        >
                            {/* Keep your existing icon here */}
                        </div>

                        <div>
                            <p className="asset-overview__eyebrow">
                                Asset details
                            </p>

                            <h1>{asset.name}</h1>

                            <div className="asset-overview__meta">
                                {asset.category && (
                                    <span className="asset-overview__badge">
                                        {asset.category}
                                    </span>
                                )}

                                <span className="asset-overview__location">
                                    {/* Keep your existing location icon here */}

                                    {asset.location ||
                                        "Location not specified"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        className="btn btn--secondary asset-overview__edit"
                        to={`/assets/${asset.id}/edit`}
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

                        Edit Asset
                    </Link>
                </div>

                <dl className="asset-overview__details">
                    <div className="asset-overview__detail">
                        <dt>Home</dt>

                        <dd>
                            {home ? (
                                <Link
                                    className="asset-overview__home-link"
                                    to={`/homes/${home.id}`}
                                >
                                    {home.name}
                                </Link>
                            ) : (
                                "Not specified"
                            )}
                        </dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Manufacturer</dt>
                        <dd>
                            {asset.manufacturer ||
                                "Not specified"}
                        </dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Model Number</dt>
                        <dd>
                            {asset.model_number ||
                                "Not specified"}
                        </dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Serial Number</dt>
                        <dd>
                            {asset.serial_number ||
                                "Not specified"}
                        </dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Purchase Cost</dt>
                        <dd>
                            {asset.purchase_cost
                                ? Number(
                                    asset.purchase_cost,
                                ).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })
                                : "Not specified"}
                        </dd>
                    </div>
                </dl>
            </section>

            <div className="asset-details-page__grid">
                <section
                    className="asset-page-card"
                    aria-labelledby="add-maintenance-title"
                >
                    <div className="asset-page-card__header">
                        <div>
                            <p className="asset-page-card__eyebrow">
                                New record
                            </p>

                            <h2 id="add-maintenance-title">
                                Add Maintenance Event
                            </h2>
                        </div>

                        <div
                            className="asset-page-card__header-icon"
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
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="16"
                                    rx="2"
                                />
                                <path d="M16 3v4M8 3v4M3 10h18" />
                                <path d="M12 14v4M10 16h4" />
                            </svg>
                        </div>
                    </div>

                    <form
                        className="form asset-maintenance-form"
                        onSubmit={handleCreateEvent}
                    >
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="event_type"
                            >
                                Event Type
                                <span className="form__required">
                                    *
                                </span>
                            </label>

                            <select
                                className="form__select"
                                id="event_type"
                                name="event_type"
                                value={eventForm.event_type}
                                onChange={handleEventChange}
                                required
                            >
                                <option value="inspection">
                                    Inspection
                                </option>
                                <option value="service">
                                    Service
                                </option>
                                <option value="repair">
                                    Repair
                                </option>
                                <option value="replacement">
                                    Replacement
                                </option>
                            </select>
                        </div>

                        <div className="form__row">
                            <div className="form__group">
                                <label
                                    className="form__label"
                                    htmlFor="event_date"
                                >
                                    Event Date
                                    <span className="form__required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="form__input"
                                    id="event_date"
                                    name="event_date"
                                    type="date"
                                    value={eventForm.event_date}
                                    onChange={handleEventChange}
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label
                                    className="form__label"
                                    htmlFor="cost"
                                >
                                    Cost
                                </label>

                                <div className="asset-maintenance-form__cost">
                                    <span aria-hidden="true">
                                        $
                                    </span>

                                    <input
                                        className="form__input"
                                        id="cost"
                                        name="cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={eventForm.cost}
                                        onChange={
                                            handleEventChange
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="notes"
                            >
                                Notes
                            </label>

                            <textarea
                                className="form__textarea"
                                id="notes"
                                name="notes"
                                value={eventForm.notes}
                                onChange={handleEventChange}
                                placeholder="Add details about the work performed..."
                                rows="5"
                            />
                        </div>

                        <div className="form__actions asset-maintenance-form__actions">
                            <button
                                className="btn btn--primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Adding..."
                                    : "Add Maintenance Event"}
                            </button>
                        </div>
                    </form>
                </section>

                <section
                    className="asset-page-card"
                    aria-labelledby="maintenance-history-title"
                >
                    <div className="asset-page-card__header">
                        <div>
                            <p className="asset-page-card__eyebrow">
                                Service records
                            </p>

                            <h2 id="maintenance-history-title">
                                Maintenance History
                            </h2>
                        </div>

                        <span className="asset-page-card__count">
                            {events.length}
                        </span>
                    </div>

                    {events.length === 0 ? (
                        <div className="maintenance-history__empty">
                            <div
                                className="maintenance-history__empty-icon"
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
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    />
                                    <path d="M16 3v4M8 3v4M3 10h18" />
                                    <path d="M8 15h8" />
                                </svg>
                            </div>

                            <h3>
                                No maintenance history yet
                            </h3>

                            <p>
                                Add the first maintenance event
                                to begin building a service
                                history for this asset.
                            </p>
                        </div>
                    ) : (
                        <div className="maintenance-history">
                            {events.map((event) => (
                                <article
                                    className="maintenance-history__item"
                                    key={event.id}
                                >
                                    <div
                                        className="maintenance-history__icon"
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
                                            <path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a4.2 4.2 0 0 1 5.5-5.5l-3 3" />
                                            <path d="m15 15 6 6" />
                                        </svg>
                                    </div>

                                    <div className="maintenance-history__content">
                                        <div className="maintenance-history__heading">
                                            <h3>
                                                {
                                                    event.event_type
                                                }
                                            </h3>

                                            <span className="maintenance-history__status">
                                                Complete
                                            </span>
                                        </div>

                                        <p className="maintenance-history__date">
                                            {new Date(
                                                event.event_date,
                                            ).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                },
                                            )}
                                        </p>

                                        <p className="maintenance-history__notes">
                                            {event.notes ||
                                                "No notes added."}
                                        </p>

                                        <p className="maintenance-history__cost">
                                            <span>Cost</span>

                                            <strong>
                                                {event.cost
                                                    ? Number(
                                                        event.cost,
                                                    ).toLocaleString(
                                                        "en-US",
                                                        {
                                                            style: "currency",
                                                            currency:
                                                                "USD",
                                                        },
                                                    )
                                                    : "Not specified"}
                                            </strong>
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}