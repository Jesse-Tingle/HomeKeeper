import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";
import "../styles/add-home.css";

export default function EditHomePage() {
    const { id } = useParams();
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

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadHome = async () => {
            try {
                setIsLoading(true);
                setError("");

                const homeData = await apiClient.get(`/homes/${id}`);

                if (!isMounted) {
                    return;
                }

                setHomeForm({
                    name: homeData.name || "",
                    type: homeData.type || "",
                    street_address: homeData.street_address || "",
                    city: homeData.city || "",
                    state: homeData.state || "",
                    postal_code: homeData.postal_code || "",
                    country: homeData.country || "",
                });
            } catch (requestError) {
                if (isMounted) {
                    setError(
                        requestError.message ||
                        "Unable to load this home.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadHome();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleHomeChange = (event) => {
        const { name, value } = event.target;

        setHomeForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleUpdateHome = async (event) => {
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

            await apiClient.put(`/homes/${id}`, payload);

            navigate(`/homes/${id}`);
        } catch (requestError) {
            console.error("Unable to update home:", requestError);

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
            <div className="add-home-page">
                <p>Loading home details...</p>
            </div>
        );
    }

    return (
        <div className="add-home-page">
            <Link
                className="add-home-page__back"
                to={`/homes/${id}`}
            >
                <span aria-hidden="true">←</span>
                Back to Home
            </Link>

            <section className="add-home-card">
                <div className="add-home-card__header">
                    <div>
                        <p className="add-home-card__eyebrow">
                            Edit property
                        </p>

                        <h1>Edit Home</h1>

                        <p>
                            Update this property&apos;s name, type, and
                            address information.
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
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                        </svg>
                    </div>
                </div>

                {error && (
                    <div
                        className="add-home-page__error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form
                    className="form add-home-form"
                    onSubmit={handleUpdateHome}
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
                            />
                        </div>
                    </div>

                    <div className="form__actions add-home-form__actions">
                        <Link
                            className="btn btn--secondary"
                            to={`/homes/${id}`}
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