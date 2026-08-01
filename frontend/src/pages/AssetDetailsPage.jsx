import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/asset-details.css";

const EMPTY_EVENT_FORM = {
    event_type: "inspection",
    event_date: "",
    cost: "",
    notes: "",
};

function formatCurrency(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Not specified";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return "Not specified";
    }

    return numericValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

function formatEventDate(value) {
    if (!value) {
        return "Date not specified";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date not specified";
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function PencilIcon() {
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
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}

function ToolIcon() {
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

            <circle
                cx="12"
                cy="10"
                r="2.5"
            />
        </svg>
    );
}

function CalendarAddIcon() {
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
    );
}

function TrashIcon() {
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
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6 18 20H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
        </svg>
    );
}

export default function AssetDetailsPage() {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [home, setHome] = useState(null);
    const [events, setEvents] = useState([]);

    const [eventForm, setEventForm] = useState(
        EMPTY_EVENT_FORM,
    );

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    /*
     * This stores the ID of the maintenance event currently
     * being deleted. It lets us disable only that event's
     * button and display its individual loading state.
     */
    const [deletingEventId, setDeletingEventId] =
        useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadAssetDetails = async () => {
            try {
                setIsLoading(true);
                setError("");

                const assetData = await apiClient.get(
                    `/assets/${id}`,
                );

                if (!assetData) {
                    throw new Error(
                        "Asset data was not returned.",
                    );
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
                setHome(homeData);

                setEvents(
                    Array.isArray(eventData)
                        ? eventData
                        : [],
                );
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

        loadAssetDetails();

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
                cost:
                    eventForm.cost === ""
                        ? undefined
                        : Number(eventForm.cost),
                notes:
                    eventForm.notes.trim() || undefined,
            };

            const newEvent = await apiClient.post(
                "/assets/maintenance-events",
                payload,
            );

            setEvents((previousEvents) => [
                newEvent,
                ...previousEvents,
            ]);

            setEventForm(EMPTY_EVENT_FORM);
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

    const handleDeleteEvent = async (
        maintenanceEvent,
    ) => {
        if (
            !maintenanceEvent ||
            !maintenanceEvent.id
        ) {
            setError(
                "This maintenance event could not be identified.",
            );

            return;
        }

        const eventType =
            maintenanceEvent.event_type ||
            "maintenance";

        const confirmed = window.confirm(
            `Are you sure you want to delete this ${eventType} event? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setDeletingEventId(maintenanceEvent.id);

        try {
            await apiClient.delete(
                `/assets/maintenance-events/${maintenanceEvent.id}`,
            );

            setEvents((previousEvents) =>
                previousEvents.filter(
                    (event) =>
                        event.id !==
                        maintenanceEvent.id,
                ),
            );
        } catch (requestError) {
            console.error(
                "Unable to delete maintenance event:",
                requestError,
            );

            setError(
                requestError.message ||
                "Unable to delete the maintenance event.",
            );
        } finally {
            setDeletingEventId(null);
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
                <div
                    className="asset-details-page__error"
                    role="alert"
                >
                    {error}
                </div>

                <Link
                    className="btn btn--secondary"
                    to="/homes"
                >
                    Return to Homes
                </Link>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="asset-details-page">
                <p>Asset not found.</p>

                <Link
                    className="btn btn--secondary"
                    to="/homes"
                >
                    Return to Homes
                </Link>
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
                            <ToolIcon />
                        </div>

                        <div>
                            <p className="asset-overview__eyebrow">
                                Asset details
                            </p>

                            <h1>{asset.name}</h1>

                            <div className="asset-overview__meta">
                                {asset.category && (
                                    <span className="asset-overview__badge">
                                        {
                                            asset.category
                                        }
                                    </span>
                                )}

                                <span className="asset-overview__location">
                                    <LocationIcon />

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
                        <PencilIcon />
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
                            {formatCurrency(
                                asset.purchase_cost,
                            )}
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
                            <CalendarAddIcon />
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
                                value={
                                    eventForm.event_type
                                }
                                onChange={
                                    handleEventChange
                                }
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
                                    value={
                                        eventForm.event_date
                                    }
                                    onChange={
                                        handleEventChange
                                    }
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
                                        value={
                                            eventForm.cost
                                        }
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
                                onChange={
                                    handleEventChange
                                }
                                placeholder="Add details about the work performed..."
                                rows="5"
                            />
                        </div>

                        <div className="form__actions asset-maintenance-form__actions">
                            <button
                                className="btn btn--primary"
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    deletingEventId !== null
                                }
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
                                <CalendarIcon />
                            </div>

                            <h3>
                                No maintenance history yet
                            </h3>

                            <p>
                                Add the first maintenance
                                event to begin building a
                                service history for this
                                asset.
                            </p>
                        </div>
                    ) : (
                        <div className="maintenance-history">
                            {events.map(
                                (maintenanceEvent) => {
                                    const isDeleting =
                                        deletingEventId ===
                                        maintenanceEvent.id;

                                    return (
                                        <article
                                            className="maintenance-history__item"
                                            key={
                                                maintenanceEvent.id
                                            }
                                        >
                                            <div
                                                className="maintenance-history__icon"
                                                aria-hidden="true"
                                            >
                                                <ToolIcon />
                                            </div>

                                            <div className="maintenance-history__content">
                                                <div className="maintenance-history__heading">
                                                    <div className="maintenance-history__title-group">
                                                        <h3 className="maintenance-history__event-type">
                                                            {
                                                                maintenanceEvent.event_type
                                                            }
                                                        </h3>

                                                        <span className="maintenance-history__status">
                                                            Complete
                                                        </span>
                                                    </div>

                                                    <button
                                                        className="maintenance-history__delete"
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteEvent(
                                                                maintenanceEvent,
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ||
                                                            deletingEventId !==
                                                            null
                                                        }
                                                        aria-label={`Delete ${maintenanceEvent.event_type} maintenance event`}
                                                    >
                                                        {isDeleting ? (
                                                            <>
                                                                <span
                                                                    className="maintenance-history__delete-spinner"
                                                                    aria-hidden="true"
                                                                />

                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TrashIcon />
                                                                Delete
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <p className="maintenance-history__date">
                                                    {formatEventDate(
                                                        maintenanceEvent.event_date,
                                                    )}
                                                </p>

                                                <p className="maintenance-history__notes">
                                                    {maintenanceEvent.notes ||
                                                        "No notes added."}
                                                </p>

                                                <p className="maintenance-history__cost">
                                                    <span>
                                                        Cost
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            maintenanceEvent.cost,
                                                        )}
                                                    </strong>
                                                </p>
                                            </div>
                                        </article>
                                    );
                                },
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}