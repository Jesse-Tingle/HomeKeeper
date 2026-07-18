import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AssetCard from "../components/assets/AssetCard";
import HomeSummaryCard from "../components/homes/HomeSummaryCard";

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
        location: "",
        purchase_cost: ""
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
                location: assetForm.location || undefined,
                purchase_cost: assetForm.purchase_cost
                    ? Number(assetForm.purchase_cost)
                    : undefined
            };

            const newAsset = await apiClient.post("/assets", payload);

            setAssets((prevAssets) => [newAsset, ...prevAssets]);

            setAssetForm({
                name: "",
                category: "",
                manufacturer: "",
                model_number: "",
                serial_number: "",
                location: "",
                purchase_cost: ""
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

            <HomeSummaryCard
                home={home}
                editPath={`/homes/${home.id}/edit`}
            />

            <section>
                <h2>Add Asset</h2>

                {error && <p className="form__error">{error}</p>}

                <form className="form" onSubmit={handleCreateAsset}>
                    <div className="form__row">
                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-name">
                                Asset Name
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="asset-name"
                                name="name"
                                type="text"
                                value={assetForm.name}
                                onChange={handleAssetChange}
                                placeholder="Water Heater"
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-category">
                                Category
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="asset-category"
                                name="category"
                                type="text"
                                value={assetForm.category}
                                onChange={handleAssetChange}
                                placeholder="Plumbing, HVAC, Appliance..."
                                required
                            />
                        </div>
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-manufacturer">
                                Manufacturer
                            </label>

                            <input
                                className="form__input"
                                id="asset-manufacturer"
                                name="manufacturer"
                                type="text"
                                value={assetForm.manufacturer}
                                onChange={handleAssetChange}
                                placeholder="Rheem"
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-location">
                                Location
                            </label>

                            <input
                                className="form__input"
                                id="asset-location"
                                name="location"
                                type="text"
                                value={assetForm.location}
                                onChange={handleAssetChange}
                                placeholder="Basement, Garage..."
                            />
                        </div>
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-model-number">
                                Model Number
                            </label>

                            <input
                                className="form__input"
                                id="asset-model-number"
                                name="model_number"
                                type="text"
                                value={assetForm.model_number}
                                onChange={handleAssetChange}
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label" htmlFor="asset-serial-number">
                                Serial Number
                            </label>

                            <input
                                className="form__input"
                                id="asset-serial-number"
                                name="serial_number"
                                type="text"
                                value={assetForm.serial_number}
                                onChange={handleAssetChange}
                            />
                        </div>
                    </div>

                    <div className="form__group">
                        <label className="form__label" htmlFor="asset-purchase-cost">
                            Purchase Cost
                        </label>

                        <input
                            className="form__input"
                            id="asset-purchase-cost"
                            name="purchase_cost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={assetForm.purchase_cost}
                            onChange={handleAssetChange}
                            placeholder="899.99"
                        />

                        <p className="form__help">
                            Enter the original purchase price, if known.
                        </p>
                    </div>

                    <div className="form__actions">
                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding..." : "Add Asset"}
                        </button>
                    </div>
                </form>
            </section>

            <section>
                <h2>Assets</h2>

                {assets.length === 0 ? (
                    <div className="empty-state">
                        <h3>No assets added yet</h3>
                        <p>Add an appliance, system, or other home asset to get started.</p>
                    </div>
                ) : (
                    <div className="asset-grid">
                        {assets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}