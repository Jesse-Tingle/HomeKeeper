import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        setIsLoading(true);

        try {
            await login({
                email: formData.email.trim(),
                password: formData.password
            });

            const destination =
                location.state?.from?.pathname || "/dashboard";

            navigate(destination, {
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
            title="Welcome back"
            description="Sign in to continue managing your homes."
            footerText="Don't have an account?"
            footerLinkText="Create an account"
            footerLinkTo="/register"
            icon={
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14v3" />
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
                            placeholder="Enter your password"
                            autoComplete="current-password"
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
                            {showPassword ? (
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
                            ) : (
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
                            )}
                        </button>
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
                            Signing in...
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
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <path d="m10 17 5-5-5-5" />
                                <path d="M15 12H3" />
                            </svg>

                            Sign in
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}