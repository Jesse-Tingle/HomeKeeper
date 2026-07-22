import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AssetCard from "../components/assets/AssetCard";
import HomeSummaryCard from "../components/homes/HomeSummaryCard";
import "../styles/home-details.css";

import apiClient from "../api/apiClient";

export default function HomeDetailsPage() {
    const { id } = useParams();

    const [home, setHome] = useState(null);
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);

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
                name: assetForm.name.trim(),
                category: assetForm.category.trim(),
                manufacturer: assetForm.manufacturer.trim() || undefined,
                model_number: assetForm.model_number.trim() || undefined,
                serial_number: assetForm.serial_number.trim() || undefined,
                location: assetForm.location.trim() || undefined,
                purchase_cost: assetForm.purchase_cost
                    ? Number(assetForm.purchase_cost)
                    : undefined,
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

            setIsAssetFormOpen(false);

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
        <div className="home-details-page">
            <Link
                className="home-details-page__back"
                to="/dashboard"
            >
                <span aria-hidden="true">←</span>
                Back to Dashboard
            </Link>

            {error && (
                <div className="home-details-page__error" role="alert">
                    {error}
                </div>
            )}

            <HomeSummaryCard
                home={home}
                editPath={`/homes/${home.id}/edit`}
            />

            <section
                className={[
                    "home-page-card",
                    "home-page-card--form",
                    isAssetFormOpen ? "home-page-card--open" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                aria-labelledby="add-asset-title"
            >
                <button
                    className="home-page-card__toggle"
                    type="button"
                    aria-expanded={isAssetFormOpen}
                    aria-controls="add-asset-form"
                    onClick={() =>
                        setIsAssetFormOpen((previousState) => !previousState)
                    }
                >
                    <div className="home-page-card__toggle-content">
                        <div
                            className="home-page-card__header-icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a4.2 4.2 0 0 1 5.5-5.5l-3 3" />
                                <path d="m15 15 6 6" />
                                <path d="m17 13 4 4" />
                            </svg>
                        </div>

                        <div>
                            <p className="home-page-card__eyebrow">
                                New asset
                            </p>

                            <h2 id="add-asset-title">Add Asset</h2>

                            <p className="home-page-card__description">
                                Add an appliance, system, or other important item
                                associated with this home.
                            </p>
                        </div>
                    </div>

                    <span
                        className="home-page-card__toggle-action"
                        aria-hidden="true"
                    >
                        <span>
                            {isAssetFormOpen ? "Close form" : "Add an asset"}
                        </span>

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </span>
                </button>

                {isAssetFormOpen && (
                    <div
                        className="home-page-card__collapsible"
                        id="add-asset-form"
                    >
                        <form
                            className="form home-asset-form"
                            onSubmit={handleCreateAsset}
                        >
                            <div className="form__row">
                                <div className="form__group">
                                    <label
                                        className="form__label"
                                        htmlFor="asset-name"
                                    >
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
                                    <label
                                        className="form__label"
                                        htmlFor="asset-category"
                                    >
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
                                    <label
                                        className="form__label"
                                        htmlFor="asset-manufacturer"
                                    >
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
                                    <label
                                        className="form__label"
                                        htmlFor="asset-location"
                                    >
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
                                    <label
                                        className="form__label"
                                        htmlFor="asset-model-number"
                                    >
                                        Model Number
                                    </label>

                                    <input
                                        className="form__input"
                                        id="asset-model-number"
                                        name="model_number"
                                        type="text"
                                        value={assetForm.model_number}
                                        onChange={handleAssetChange}
                                        placeholder="Model number"
                                    />
                                </div>

                                <div className="form__group">
                                    <label
                                        className="form__label"
                                        htmlFor="asset-serial-number"
                                    >
                                        Serial Number
                                    </label>

                                    <input
                                        className="form__input"
                                        id="asset-serial-number"
                                        name="serial_number"
                                        type="text"
                                        value={assetForm.serial_number}
                                        onChange={handleAssetChange}
                                        placeholder="Serial number"
                                    />
                                </div>
                            </div>

                            <div className="form__group">
                                <label
                                    className="form__label"
                                    htmlFor="asset-purchase-cost"
                                >
                                    Purchase Cost
                                </label>

                                <div className="home-asset-form__cost">
                                    <span aria-hidden="true">$</span>

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
                                </div>

                                <p className="form__help">
                                    Enter the original purchase price, if known.
                                </p>
                            </div>

                            <div className="form__actions home-asset-form__actions">
                                <button
                                    className="btn btn--secondary"
                                    type="button"
                                    onClick={() => setIsAssetFormOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn--primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Adding Asset..."
                                        : "Add Asset"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </section>

            <section
                className="home-page-card home-page-card--assets"
                aria-labelledby="assets-title"
            >
                <div className="home-page-card__header">
                    <div>
                        <p className="home-page-card__eyebrow">
                            Home inventory
                        </p>

                        <h2 id="assets-title">Assets</h2>

                        <p className="home-page-card__description">
                            View and manage the appliances, systems, and other
                            items associated with this home.
                        </p>
                    </div>

                    <span className="home-page-card__count">
                        {assets.length}
                    </span>
                </div>

                {assets.length === 0 ? (
                    <div className="home-assets-empty">
                        <div
                            className="home-assets-empty__icon"
                            aria-hidden="true"
                        >
                            <svg
                                width="28"
                                height="28"
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

                        <h3>No assets added yet</h3>

                        <p>
                            Use the form above to add the first asset for this
                            home.
                        </p>
                    </div>
                ) : (
                    <div className="asset-grid">
                        {assets.map((asset) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}