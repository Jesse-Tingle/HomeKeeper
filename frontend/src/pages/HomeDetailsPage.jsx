import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";

export default function HomeDetailsPage() {
    const { id } = useParams();

    const [home, setHome] = useState(null);
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [assetForm, setAssetForm] = useState({
        name: "",
        category: "",
        manufacturer: "",
        model_number: "",
        serial_number: "",
        location: ""
    });

    useEffect(() => {
        const fetchHomeDetails = async () => {
            try {
                const homeData = await apiClient.get(`/homes/${id}`);
                const assetData = await apiClient.get(`/homes/${id}/assets`);

                setHome(homeData);
                setAssets(assetData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeDetails();
    }, [id]);

    const handleAssetChange = (event) => {
        const { name, value } = event.target;

        setAssetForm((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCreateAsset = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                home_id: id,
                name: assetForm.name,
                category: assetForm.category,
                manufacturer: assetForm.manufacturer || undefined,
                model_number: assetForm.model_number || undefined,
                serial_number: assetForm.serial_number || undefined,
                location: assetForm.location || undefined
            };

            const newAsset = await apiClient.post("/assets", payload);

            setAssets((prevAssets) => [newAsset, ...prevAssets]);

            setAssetForm({
                name: "",
                category: "",
                manufacturer: "",
                model_number: "",
                serial_number: "",
                location: ""
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p>Loading home details...</p>;
    }

    if (error && !home) {
        return <p>{error}</p>;
    }

    if (!home) {
        return <p>Home not found.</p>;
    }

    return (
        <main>
            <Link to="/">← Back to Dashboard</Link>

            <section>
                <h1>{home.name}</h1>

                <p>
                    {home.street_address}, {home.city}, {home.state}{" "}
                    {home.postal_code}
                </p>

                <p>Type: {home.type || "Not specified"}</p>
            </section>

            <section>
                <h2>Add Asset</h2>

                {error && <p>{error}</p>}

                <form onSubmit={handleCreateAsset}>
                    <div>
                        <label htmlFor="asset-name">Asset Name</label>
                        <input
                            id="asset-name"
                            name="name"
                            type="text"
                            value={assetForm.name}
                            onChange={handleAssetChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-category">Category</label>
                        <input
                            id="asset-category"
                            name="category"
                            type="text"
                            value={assetForm.category}
                            onChange={handleAssetChange}
                            required
                            placeholder="HVAC, Appliance, Roof..."
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-manufacturer">Manufacturer</label>
                        <input
                            id="asset-manufacturer"
                            name="manufacturer"
                            type="text"
                            value={assetForm.manufacturer}
                            onChange={handleAssetChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-model-number">Model Number</label>
                        <input
                            id="asset-model-number"
                            name="model_number"
                            type="text"
                            value={assetForm.model_number}
                            onChange={handleAssetChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-serial-number">Serial Number</label>
                        <input
                            id="asset-serial-number"
                            name="serial_number"
                            type="text"
                            value={assetForm.serial_number}
                            onChange={handleAssetChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="asset-location">Location</label>
                        <input
                            id="asset-location"
                            name="location"
                            type="text"
                            value={assetForm.location}
                            onChange={handleAssetChange}
                            placeholder="Basement, Garage..."
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Asset"}
                    </button>
                </form>
            </section>

            <section>
                <h2>Assets</h2>

                {assets.length === 0 ? (
                    <p>No assets have been added to this home yet.</p>
                ) : (
                    <ul>
                        {assets.map((asset) => (
                            <li key={asset.id}>
                                <h3>{asset.name}</h3>
                                <p>Category: {asset.category}</p>
                                <p>Location: {asset.location || "Not specified"}</p>
                                <p>Manufacturer: {asset.manufacturer || "Not specified"}</p>
                                <p>Model: {asset.model_number || "Not specified"}</p>
                                <p>Serial: {asset.serial_number || "Not specified"}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}