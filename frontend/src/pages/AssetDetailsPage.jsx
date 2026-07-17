import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";

export default function AssetDetailsPage() {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [eventForm, setEventForm] = useState({
        event_type: "inspection",
        event_date: "",
        cost: "",
        notes: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssetDetails = async () => {
            try {
                const assetData = await apiClient.get(`/assets/${id}`);
                const eventData = await apiClient.get(`/assets/${id}/maintenance-events`);

                setAsset(assetData);
                setEvents(eventData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssetDetails();
    }, [id]);

    const handleEventChange = (event) => {
        const { name, value } = event.target;

        setEventForm((prevData) => ({
            ...prevData,
            [name]: value
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
                cost: eventForm.cost ? Number(eventForm.cost) : undefined,
                notes: eventForm.notes || undefined
            };

            const newEvent = await apiClient.post("/assets/maintenance-events", payload);

            setEvents((prevEvents) => [newEvent, ...prevEvents]);

            setEventForm({
                event_type: "inspection",
                event_date: "",
                cost: "",
                notes: ""
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p>Loading asset details...</p>;
    if (error && !asset) return <p>{error}</p>;
    if (!asset) return <p>Asset not found.</p>;

    return (
        <main>
            <Link to={`/homes/${asset.home_id}`}>← Back to Home</Link>

            <section>
                <h1>{asset.name}</h1>
                <p>Category: {asset.category}</p>
                <p>Location: {asset.location || "Not specified"}</p>
                <p>Manufacturer: {asset.manufacturer || "Not specified"}</p>
                <p>Model: {asset.model_number || "Not specified"}</p>
                <p>Serial: {asset.serial_number || "Not specified"}</p>
            </section>

            <section>
                <h2>Add Maintenance Event</h2>

                {error && <p>{error}</p>}

                <form onSubmit={handleCreateEvent}>
                    <div>
                        <label htmlFor="event_type">Event Type</label>
                        <select
                            id="event_type"
                            name="event_type"
                            value={eventForm.event_type}
                            onChange={handleEventChange}
                        >
                            <option value="inspection">Inspection</option>
                            <option value="service">Service</option>
                            <option value="repair">Repair</option>
                            <option value="replacement">Replacement</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="event_date">Event Date</label>
                        <input
                            id="event_date"
                            name="event_date"
                            type="date"
                            value={eventForm.event_date}
                            onChange={handleEventChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cost">Cost</label>
                        <input
                            id="cost"
                            name="cost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={eventForm.cost}
                            onChange={handleEventChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={eventForm.notes}
                            onChange={handleEventChange}
                        />
                    </div>

                    <button type="submit" className="btn btn--secondary" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Maintenance Event"}
                    </button>
                </form>
            </section>

            <section>
                <h2>Maintenance History</h2>

                {events.length === 0 ? (
                    <p>No maintenance events have been added yet.</p>
                ) : (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                <h3>{event.event_type}</h3>
                                <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
                                <p>Cost: {event.cost ? `$${event.cost}` : "Not specified"}</p>
                                <p>Notes: {event.notes || "None"}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}