import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/asset-details.css";

const EMPTY_EVENT_FORM = {
    event_type: "inspection",
    event_date: "",
    cost: "",
    notes: "",
};

function formatCurrency(value) {
    if (value === null || value === undefined || value === "") {
        return "Not specified";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "Not specified";
    }

    return number.toLocaleString("en-US", {
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

function formatDateForInput(value) {
    return value ? String(value).split("T")[0] : "";
}

function PencilIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}

function ToolIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a4.2 4.2 0 0 1 5.5-5.5l-3 3" />
            <path d="m15 15 6 6" />
            <path d="m17 13 4 4" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
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
    const navigate = useNavigate();

    const [asset, setAsset] = useState(null);
    const [home, setHome] = useState(null);
    const [events, setEvents] = useState([]);

    const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
    const [editEventForm, setEditEventForm] = useState(EMPTY_EVENT_FORM);

    const [editingEventId, setEditingEventId] = useState(null);
    const [deletingEventId, setDeletingEventId] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
    const [isDeletingAsset, setIsDeletingAsset] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadAssetDetails = async () => {
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
                setHome(homeData);
                setEvents(Array.isArray(eventData) ? eventData : []);
            } catch (requestError) {
                console.error("Unable to load asset details:", requestError);

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
                notes: eventForm.notes.trim() || undefined,
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

    const handleStartEditingEvent = (maintenanceEvent) => {
        setError("");
        setEditingEventId(maintenanceEvent.id);

        setEditEventForm({
            event_type: maintenanceEvent.event_type || "inspection",
            event_date: formatDateForInput(maintenanceEvent.event_date),
            cost: maintenanceEvent.cost ?? "",
            notes: maintenanceEvent.notes || "",
        });
    };

    const handleEditEventChange = (event) => {
        const { name, value } = event.target;

        setEditEventForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleCancelEditingEvent = () => {
        setEditingEventId(null);
        setEditEventForm(EMPTY_EVENT_FORM);
    };

    const handleUpdateEvent = async (event) => {
        event.preventDefault();

        if (!editingEventId) {
            return;
        }

        setError("");
        setIsUpdatingEvent(true);

        try {
            const payload = {
                event_type: editEventForm.event_type,
                event_date: editEventForm.event_date,
                cost:
                    editEventForm.cost === ""
                        ? undefined
                        : Number(editEventForm.cost),
                notes: editEventForm.notes.trim() || undefined,
            };

            const updatedEvent = await apiClient.put(
                `/assets/maintenance-events/${editingEventId}`,
                payload,
            );

            setEvents((previousEvents) =>
                previousEvents.map((maintenanceEvent) =>
                    maintenanceEvent.id === editingEventId
                        ? updatedEvent
                        : maintenanceEvent,
                ),
            );

            handleCancelEditingEvent();
        } catch (requestError) {
            console.error(
                "Unable to update maintenance event:",
                requestError,
            );

            setError(
                requestError.message ||
                "Unable to update the maintenance event.",
            );
        } finally {
            setIsUpdatingEvent(false);
        }
    };

    const handleDeleteEvent = async (maintenanceEvent) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete this ${maintenanceEvent.event_type} event? This action cannot be undone.`,
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
                    (event) => event.id !== maintenanceEvent.id,
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

    const handleDeleteAsset = async () => {
        if (!asset) {
            return;
        }

        if (events.length > 0) {
            setError(
                "This asset cannot be deleted until all maintenance events have been removed.",
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setIsDeletingAsset(true);

        try {
            await apiClient.delete(`/assets/${asset.id}`);

            navigate(`/homes/${asset.home_id}`, {
                replace: true,
            });
        } catch (requestError) {
            console.error("Unable to delete asset:", requestError);

            setError(
                requestError.message ||
                "Unable to delete this asset.",
            );
        } finally {
            setIsDeletingAsset(false);
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
                <div className="asset-details-page__error" role="alert">
                    {error}
                </div>
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
                <div className="asset-details-page__error" role="alert">
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
                                        {asset.category}
                                    </span>
                                )}

                                <span className="asset-overview__location">
                                    {asset.location ||
                                        "Location not specified"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="asset-overview__actions">
                        <Link
                            className="btn btn--secondary"
                            to={`/assets/${asset.id}/edit`}
                        >
                            <PencilIcon />
                            Edit Asset
                        </Link>

                        <button
                            className="asset-overview__delete"
                            type="button"
                            onClick={handleDeleteAsset}
                            disabled={
                                isDeletingAsset ||
                                events.length > 0
                            }
                            title={
                                events.length > 0
                                    ? "Delete all maintenance events before deleting this asset."
                                    : `Delete ${asset.name}`
                            }
                        >
                            {isDeletingAsset ? (
                                <>
                                    <span
                                        className="asset-overview__delete-spinner"
                                        aria-hidden="true"
                                    />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <TrashIcon />
                                    Delete Asset
                                </>
                            )}
                        </button>
                    </div>
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
                            {asset.manufacturer || "Not specified"}
                        </dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Model Number</dt>
                        <dd>{asset.model_number || "Not specified"}</dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Serial Number</dt>
                        <dd>{asset.serial_number || "Not specified"}</dd>
                    </div>

                    <div className="asset-overview__detail">
                        <dt>Purchase Cost</dt>
                        <dd>{formatCurrency(asset.purchase_cost)}</dd>
                    </div>
                </dl>
            </section>

            {events.length > 0 && (
                <div className="asset-delete-notice" role="status">
                    <strong>Asset deletion is unavailable.</strong>
                    <span>
                        Delete all maintenance events before deleting
                        this asset.
                    </span>
                </div>
            )}

            <div className="asset-details-page__grid">
                <section className="asset-page-card">
                    <div className="asset-page-card__header">
                        <div>
                            <p className="asset-page-card__eyebrow">
                                New record
                            </p>
                            <h2>Add Maintenance Event</h2>
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
                            </label>

                            <select
                                className="form__select"
                                id="event_type"
                                name="event_type"
                                value={eventForm.event_type}
                                onChange={handleEventChange}
                                required
                            >
                                <option value="inspection">Inspection</option>
                                <option value="service">Service</option>
                                <option value="repair">Repair</option>
                                <option value="replacement">Replacement</option>
                            </select>
                        </div>

                        <div className="form__row">
                            <div className="form__group">
                                <label
                                    className="form__label"
                                    htmlFor="event_date"
                                >
                                    Event Date
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

                                <input
                                    className="form__input"
                                    id="cost"
                                    name="cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={eventForm.cost}
                                    onChange={handleEventChange}
                                    placeholder="0.00"
                                />
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
                                rows="5"
                            />
                        </div>

                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={
                                isSubmitting ||
                                editingEventId !== null
                            }
                        >
                            {isSubmitting
                                ? "Adding..."
                                : "Add Maintenance Event"}
                        </button>
                    </form>
                </section>

                <section className="asset-page-card">
                    <div className="asset-page-card__header">
                        <div>
                            <p className="asset-page-card__eyebrow">
                                Service records
                            </p>
                            <h2>Maintenance History</h2>
                        </div>

                        <span className="asset-page-card__count">
                            {events.length}
                        </span>
                    </div>

                    {events.length === 0 ? (
                        <div className="maintenance-history__empty">
                            <h3>No maintenance history yet</h3>
                            <p>
                                Add the first maintenance event to begin
                                building a service history.
                            </p>
                        </div>
                    ) : (
                        <div className="maintenance-history">
                            {events.map((maintenanceEvent) => (
                                <article
                                    className="maintenance-history__item"
                                    key={maintenanceEvent.id}
                                >
                                    <div className="maintenance-history__content">
                                        {editingEventId ===
                                            maintenanceEvent.id ? (
                                            <form
                                                className="maintenance-edit-form"
                                                onSubmit={handleUpdateEvent}
                                            >
                                                <div className="maintenance-edit-form__row">
                                                    <div className="form__group">
                                                        <label className="form__label">
                                                            Event Type
                                                        </label>

                                                        <select
                                                            className="form__select"
                                                            name="event_type"
                                                            value={
                                                                editEventForm.event_type
                                                            }
                                                            onChange={
                                                                handleEditEventChange
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

                                                    <div className="form__group">
                                                        <label className="form__label">
                                                            Event Date
                                                        </label>

                                                        <input
                                                            className="form__input"
                                                            name="event_date"
                                                            type="date"
                                                            value={
                                                                editEventForm.event_date
                                                            }
                                                            onChange={
                                                                handleEditEventChange
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form__group">
                                                    <label className="form__label">
                                                        Cost
                                                    </label>

                                                    <input
                                                        className="form__input"
                                                        name="cost"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            editEventForm.cost
                                                        }
                                                        onChange={
                                                            handleEditEventChange
                                                        }
                                                    />
                                                </div>

                                                <div className="form__group">
                                                    <label className="form__label">
                                                        Notes
                                                    </label>

                                                    <textarea
                                                        className="form__textarea"
                                                        name="notes"
                                                        value={
                                                            editEventForm.notes
                                                        }
                                                        onChange={
                                                            handleEditEventChange
                                                        }
                                                        rows="4"
                                                    />
                                                </div>

                                                <div className="maintenance-edit-form__actions">
                                                    <button
                                                        className="btn btn--secondary"
                                                        type="button"
                                                        onClick={
                                                            handleCancelEditingEvent
                                                        }
                                                        disabled={
                                                            isUpdatingEvent
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        className="btn btn--primary"
                                                        type="submit"
                                                        disabled={
                                                            isUpdatingEvent
                                                        }
                                                    >
                                                        {isUpdatingEvent
                                                            ? "Saving..."
                                                            : "Save Changes"}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="maintenance-history__heading">
                                                    <div>
                                                        <h3 className="maintenance-history__event-type">
                                                            {
                                                                maintenanceEvent.event_type
                                                            }
                                                        </h3>

                                                        <span className="maintenance-history__status">
                                                            Complete
                                                        </span>
                                                    </div>

                                                    <div className="maintenance-history__actions">
                                                        <button
                                                            className="maintenance-history__edit"
                                                            type="button"
                                                            onClick={() =>
                                                                handleStartEditingEvent(
                                                                    maintenanceEvent,
                                                                )
                                                            }
                                                            disabled={
                                                                editingEventId !==
                                                                null ||
                                                                deletingEventId !==
                                                                null
                                                            }
                                                        >
                                                            <PencilIcon />
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="maintenance-history__delete"
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteEvent(
                                                                    maintenanceEvent,
                                                                )
                                                            }
                                                            disabled={
                                                                editingEventId !==
                                                                null ||
                                                                deletingEventId !==
                                                                null
                                                            }
                                                        >
                                                            {deletingEventId ===
                                                                maintenanceEvent.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
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
                                                    <span>Cost</span>
                                                    <strong>
                                                        {formatCurrency(
                                                            maintenanceEvent.cost,
                                                        )}
                                                    </strong>
                                                </p>
                                            </>
                                        )}
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