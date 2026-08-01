import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/edit-asset.css";

const EMPTY_ASSET_FORM = {
    name: "",
    category: "",
    manufacturer: "",
    model_number: "",
    serial_number: "",
    location: "",
    install_date: "",
    warranty_expiration_date: "",
    expected_lifespan_years: "",
    purchase_cost: "",
    notes: "",
};

function formatDateForInput(value) {
    if (!value) {
        return "";
    }

    return String(value).split("T")[0];
}

export default function EditAssetPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [asset, setAsset] = useState(null);
    const [assetForm, setAssetForm] = useState(EMPTY_ASSET_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadAsset = async () => {
            try {
                setIsLoading(true);
                setError("");

                const assetData = await apiClient.get(`/assets/${id}`);

                if (!isMounted) {
                    return;
                }

                setAsset(assetData);

                setAssetForm({
                    name: assetData.name || "",
                    category: assetData.category || "",
                    manufacturer: assetData.manufacturer || "",
                    model_number: assetData.model_number || "",
                    serial_number: assetData.serial_number || "",
                    location: assetData.location || "",
                    install_date: formatDateForInput(
                        assetData.install_date,
                    ),
                    warranty_expiration_date: formatDateForInput(
                        assetData.warranty_expiration_date,
                    ),
                    expected_lifespan_years:
                        assetData.expected_lifespan_years ?? "",
                    purchase_cost: assetData.purchase_cost ?? "",
                    notes: assetData.notes || "",
                });
            } catch (requestError) {
                console.error("Unable to load asset:", requestError);

                if (isMounted) {
                    setError(
                        requestError.message ||
                        "Unable to load this asset.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadAsset();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAssetChange = (event) => {
        const { name, value } = event.target;

        setAssetForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleUpdateAsset = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                name: assetForm.name.trim(),
                category: assetForm.category.trim(),
                manufacturer:
                    assetForm.manufacturer.trim() || undefined,
                model_number:
                    assetForm.model_number.trim() || undefined,
                serial_number:
                    assetForm.serial_number.trim() || undefined,
                location: assetForm.location.trim() || undefined,
                install_date:
                    assetForm.install_date || undefined,
                warranty_expiration_date:
                    assetForm.warranty_expiration_date || undefined,
                expected_lifespan_years:
                    assetForm.expected_lifespan_years === ""
                        ? undefined
                        : Number(
                            assetForm.expected_lifespan_years,
                        ),
                purchase_cost:
                    assetForm.purchase_cost === ""
                        ? undefined
                        : Number(assetForm.purchase_cost),
                notes: assetForm.notes.trim() || undefined,
            };

            await apiClient.put(`/assets/${id}`, payload);

            navigate(`/assets/${id}`, {
                replace: true,
            });
        } catch (requestError) {
            console.error("Unable to update asset:", requestError);

            setError(
                requestError.message ||
                "Unable to save your changes.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="edit-asset-page">
                <p>Loading asset details...</p>
            </div>
        );
    }

    if (error && !asset) {
        return (
            <div className="edit-asset-page">
                <p>{error}</p>

                <Link className="btn btn--secondary" to="/homes">
                    Return to Homes
                </Link>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="edit-asset-page">
                <p>Asset not found.</p>
            </div>
        );
    }

    return (
        <div className="edit-asset-page">
            <Link
                className="edit-asset-page__back"
                to={`/assets/${id}`}
            >
                <span aria-hidden="true">←</span>
                Back to Asset
            </Link>

            <section className="edit-asset-card">
                <header className="edit-asset-card__header">
                    <div>
                        <p className="edit-asset-card__eyebrow">
                            Asset management
                        </p>

                        <h1>Edit Asset</h1>

                        <p>
                            Update the identifying, purchase, warranty,
                            and location information for {asset.name}.
                        </p>
                    </div>

                    <div
                        className="edit-asset-card__icon"
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
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                        </svg>
                    </div>
                </header>

                {error && (
                    <div
                        className="edit-asset-page__error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form
                    className="form edit-asset-form"
                    onSubmit={handleUpdateAsset}
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
                                placeholder="HVAC, Appliance, Plumbing..."
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
                                placeholder="Basement, kitchen, garage..."
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
                            />
                        </div>
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="asset-install-date"
                            >
                                Installation Date
                            </label>

                            <input
                                className="form__input"
                                id="asset-install-date"
                                name="install_date"
                                type="date"
                                value={assetForm.install_date}
                                onChange={handleAssetChange}
                            />
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="asset-warranty-expiration"
                            >
                                Warranty Expiration
                            </label>

                            <input
                                className="form__input"
                                id="asset-warranty-expiration"
                                name="warranty_expiration_date"
                                type="date"
                                value={
                                    assetForm.warranty_expiration_date
                                }
                                onChange={handleAssetChange}
                            />
                        </div>
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="asset-lifespan"
                            >
                                Expected Lifespan
                            </label>

                            <div className="edit-asset-form__suffix">
                                <input
                                    className="form__input"
                                    id="asset-lifespan"
                                    name="expected_lifespan_years"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={
                                        assetForm.expected_lifespan_years
                                    }
                                    onChange={handleAssetChange}
                                    placeholder="10"
                                />

                                <span>years</span>
                            </div>
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="asset-purchase-cost"
                            >
                                Purchase Cost
                            </label>

                            <div className="edit-asset-form__currency">
                                <span aria-hidden="true">$</span>

                                <input
                                    className="form__input"
                                    id="asset-purchase-cost"
                                    name="purchase_cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={assetForm.purchase_cost}
                                    onChange={handleAssetChange}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form__group">
                        <label
                            className="form__label"
                            htmlFor="asset-notes"
                        >
                            Notes
                        </label>

                        <textarea
                            className="form__textarea"
                            id="asset-notes"
                            name="notes"
                            value={assetForm.notes}
                            onChange={handleAssetChange}
                            rows="5"
                            placeholder="Add notes about this asset..."
                        />
                    </div>

                    <div className="form__actions edit-asset-form__actions">
                        <Link
                            className="btn btn--secondary"
                            to={`/assets/${id}`}
                        >
                            Cancel
                        </Link>

                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}