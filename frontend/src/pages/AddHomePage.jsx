import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/add-home.css";

export default function AddHomePage() {
    const navigate = useNavigate();

    const [homeForm, setHomeForm] = useState({
        name: "",
        type: "",
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleHomeChange = (event) => {
        const { name, value } = event.target;

        setHomeForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleCreateHome = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                name: homeForm.name.trim(),
                type: homeForm.type.trim() || undefined,
                street_address: homeForm.street_address.trim(),
                city: homeForm.city.trim(),
                state: homeForm.state.trim(),
                postal_code: homeForm.postal_code.trim(),
                country: homeForm.country.trim() || undefined,
            };

            const newHome = await apiClient.post("/homes", payload);

            navigate(`/homes/${newHome.id}`);
        } catch (requestError) {
            console.error("Unable to create home:", requestError);

            setError(
                requestError.message ||
                "Unable to create the home. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-home-page">
            <Link className="add-home-page__back" to="/homes">
                <span aria-hidden="true">←</span>
                Back to Homes
            </Link>

            <section className="add-home-card">
                <div className="add-home-card__header">
                    <div>
                        <p className="add-home-card__eyebrow">
                            New property
                        </p>

                        <h1>Add Home</h1>

                        <p>
                            Add a home to begin tracking its assets,
                            maintenance, and important details.
                        </p>
                    </div>

                    <div
                        className="add-home-card__icon"
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
                            <path d="M3 11.5 12 4l9 7.5" />
                            <path d="M5.5 10.5V20h13v-9.5" />
                            <path d="M9.5 20v-6h5v6" />
                            <path d="M19 4v6M16 7h6" />
                        </svg>
                    </div>
                </div>

                {error && (
                    <div className="add-home-page__error" role="alert">
                        {error}
                    </div>
                )}

                <form
                    className="form add-home-form"
                    onSubmit={handleCreateHome}
                >
                    <div className="form__row">
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="home-name"
                            >
                                Home Name
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="home-name"
                                name="name"
                                type="text"
                                value={homeForm.name}
                                onChange={handleHomeChange}
                                placeholder="Primary Residence"
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="home-type"
                            >
                                Home Type
                            </label>

                            <select
                                className="form__select"
                                id="home-type"
                                name="type"
                                value={homeForm.type}
                                onChange={handleHomeChange}
                            >
                                <option value="">Select a type</option>
                                <option value="Primary">
                                    Primary Residence
                                </option>
                                <option value="Rental">Rental</option>
                                <option value="Vacation">
                                    Vacation Home
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form__group">
                        <label
                            className="form__label"
                            htmlFor="street-address"
                        >
                            Street Address
                            <span className="form__required">*</span>
                        </label>

                        <input
                            className="form__input"
                            id="street-address"
                            name="street_address"
                            type="text"
                            value={homeForm.street_address}
                            onChange={handleHomeChange}
                            placeholder="123 Main Street"
                            autoComplete="street-address"
                            required
                        />
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="home-city"
                            >
                                City
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="home-city"
                                name="city"
                                type="text"
                                value={homeForm.city}
                                onChange={handleHomeChange}
                                autoComplete="address-level2"
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="home-state"
                            >
                                State
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="home-state"
                                name="state"
                                type="text"
                                value={homeForm.state}
                                onChange={handleHomeChange}
                                placeholder="IN"
                                autoComplete="address-level1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form__row">
                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="postal-code"
                            >
                                Postal Code
                                <span className="form__required">*</span>
                            </label>

                            <input
                                className="form__input"
                                id="postal-code"
                                name="postal_code"
                                type="text"
                                value={homeForm.postal_code}
                                onChange={handleHomeChange}
                                autoComplete="postal-code"
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label
                                className="form__label"
                                htmlFor="home-country"
                            >
                                Country
                            </label>

                            <input
                                className="form__input"
                                id="home-country"
                                name="country"
                                type="text"
                                value={homeForm.country}
                                onChange={handleHomeChange}
                                placeholder="United States"
                                autoComplete="country-name"
                            />
                        </div>
                    </div>

                    <div className="form__actions add-home-form__actions">
                        <Link
                            className="btn btn--secondary"
                            to="/homes"
                        >
                            Cancel
                        </Link>

                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating Home..."
                                : "Create Home"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}