import { Link } from "react-router-dom";

import "../../styles/auth.css";

export default function AuthLayout({
    children,
    icon,
    title,
    description,
    footerText,
    footerLinkText,
    footerLinkTo
}) {
    return (
        <main className="auth-page">
            <div className="auth-page__background" aria-hidden="true">
                <div className="auth-page__hill auth-page__hill--one" />
                <div className="auth-page__hill auth-page__hill--two" />

                <svg
                    className="auth-page__house"
                    viewBox="0 0 180 120"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M28 63 90 18l62 45v47H28V63Z"
                        fill="currentColor"
                        opacity="0.14"
                    />
                    <path
                        d="m19 68 71-51 71 51"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.25"
                    />
                    <path
                        d="M75 110V73h30v37"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                        opacity="0.28"
                    />
                    <path
                        d="M39 67v43h102V67"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                        opacity="0.28"
                    />
                    <path
                        d="M121 41V22h16v31"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.28"
                    />
                </svg>
            </div>

            <header className="auth-brand">
                <Link className="auth-brand__link" to="/">
                    <span className="auth-brand__icon" aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 10 9-7 9 7" />
                            <path d="M5 9v11h14V9" />
                            <path d="M9 20v-6h6v6" />
                        </svg>
                    </span>

                    <span>
                        <strong>HomeKeeper</strong>
                        <small>Home Maintenance Tracker</small>
                    </span>
                </Link>
            </header>

            <section className="auth-card">
                <div className="auth-card__icon" aria-hidden="true">
                    {icon}
                </div>

                <div className="auth-card__header">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                {children}

                <div className="auth-card__divider">
                    <span />
                    <p>{footerText}</p>
                    <span />
                </div>

                <Link className="auth-card__secondary-link" to={footerLinkTo}>
                    {footerLinkText}
                </Link>
            </section>

            <footer className="auth-page__security">
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

                <span>Your information is protected and never shared.</span>
            </footer>
        </main>
    );
}