import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            navigate("/dashboard", {
                replace: true
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            description="Join HomeKeeper and get your home organized."
            footerText="Already have an account?"
            footerLinkText="Sign in instead"
            footerLinkTo="/login"
            icon={
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M19 8v6" />
                    <path d="M22 11h-6" />
                </svg>
            }
        >
            {error && (
                <div className="auth-alert" role="alert">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>

                    <span>{error}</span>
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form__group">
                    <label htmlFor="name">Full name</label>

                    <div className="auth-form__control">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20 21a8 8 0 0 0-16 0" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            autoComplete="name"
                            required
                        />
                    </div>
                </div>

                <div className="auth-form__group">
                    <label htmlFor="email">Email address</label>

                    <div className="auth-form__control">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>
                </div>

                <div className="auth-form__group">
                    <label htmlFor="password">Password</label>

                    <div className="auth-form__control">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="5" y="10" width="14" height="11" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>

                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            minLength="8"
                            required
                        />

                        <button
                            className="auth-form__visibility"
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            <PasswordVisibilityIcon visible={showPassword} />
                        </button>
                    </div>
                </div>

                <div className="auth-form__group">
                    <label htmlFor="confirmPassword">Confirm password</label>

                    <div className="auth-form__control">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="5" y="10" width="14" height="11" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter your password again"
                            autoComplete="new-password"
                            minLength="8"
                            required
                        />

                        <button
                            className="auth-form__visibility"
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((current) => !current)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                        >
                            <PasswordVisibilityIcon
                                visible={showConfirmPassword}
                            />
                        </button>
                    </div>
                </div>

                <div className="auth-password-tip">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>

                    <div>
                        <strong>Strong password recommended</strong>
                        <p>
                            Use at least 8 characters with a mix of letters,
                            numbers, and symbols.
                        </p>
                    </div>
                </div>

                <button
                    className="auth-form__submit"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="auth-spinner" aria-hidden="true" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <path d="M19 8v6" />
                                <path d="M22 11h-6" />
                            </svg>

                            Create account
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

function PasswordVisibilityIcon({ visible }) {
    if (visible) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m3 3 18 18" />
                <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                <path d="M9.9 4.2A10.4 10.4 0 0 1 12 4c5 0 8.5 4 9.5 6-.4.8-1.2 2-2.3 3.1" />
                <path d="M6.6 6.6C4.5 8 3.2 10 2.5 11.5 3.5 13.5 7 17.5 12 17.5c1 0 2-.2 2.8-.5" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}