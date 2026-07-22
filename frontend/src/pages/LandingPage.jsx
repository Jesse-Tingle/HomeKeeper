import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

function HomeIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5.5 10.5V20h13v-9.5" />
            <path d="M9.5 20v-6h5v6" />
        </svg>
    );
}

function ToolsIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m14.7 6.3 3-3a4.2 4.2 0 0 1-5.5 5.5l-6.7 6.7a2.1 2.1 0 0 1-3-3l6.7-6.7a4.2 4.2 0 0 1 5.5-5.5l-3 3" />
            <path d="m15 15 6 6" />
            <path d="m17 13 4 4" />
        </svg>
    );
}

function CalendarIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
    );
}

function ShieldIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function DollarIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M16 8.5c-.8-1-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.5s1.3 2.2 3.5 2.7c2.2.5 3.5 1.2 3.5 2.8s-1.5 2.7-3.8 2.7c-1.7 0-3.1-.6-4.2-1.7" />
            <path d="M12 5v14" />
        </svg>
    );
}

function DocumentIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 2h8l4 4v16H6Z" />
            <path d="M14 2v5h5M9 12h6M9 16h6" />
        </svg>
    );
}

function SearchIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

function UsersIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function ChartIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
    );
}

function ArrowIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

const primaryFeatures = [
    {
        title: "Manage Homes",
        description:
            "Keep information for one or multiple homes organized in one place.",
        icon: HomeIcon,
    },
    {
        title: "Track Assets",
        description:
            "Record details for every appliance, system, and important asset in your home.",
        icon: ToolsIcon,
    },
    {
        title: "Stay on Top",
        description:
            "Build a complete maintenance history and stay ahead of important home tasks.",
        icon: CalendarIcon,
    },
];

const additionalFeatures = [
    {
        title: "Track Warranties",
        description: "Keep expiration dates and warranty details easy to find.",
        icon: ShieldIcon,
    },
    {
        title: "Record Costs",
        description: "Track asset purchases, repairs, and maintenance expenses.",
        icon: DollarIcon,
    },
    {
        title: "Store Details",
        description: "Keep model numbers, serial numbers, and important notes together.",
        icon: DocumentIcon,
    },
    {
        title: "Find It Fast",
        description: "Quickly locate the home or asset information you need.",
        icon: SearchIcon,
    },
    {
        title: "Share Access",
        description: "Manage a home together with spouses, family, or roommates.",
        icon: UsersIcon,
    },
    {
        title: "See the History",
        description: "View a complete record of maintenance performed on each asset.",
        icon: ChartIcon,
    },
];

export default function LandingPage() {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="landing-container landing-header__inner">
                    <Link className="landing-brand" to="/" aria-label="HomeKeeper home">
                        <span className="landing-brand__icon">
                            <HomeIcon />
                        </span>

                        <span>
                            Home<span>Keeper</span>
                        </span>
                    </Link>

                    <nav className="landing-nav" aria-label="Main navigation">
                        <a className="landing-nav__link" href="#features">
                            Features
                        </a>

                        <a className="landing-nav__link" href="#about">
                            About
                        </a>

                        <Link
                            className="btn btn--secondary landing-nav__login"
                            to="/login"
                        >
                            Log In
                        </Link>

                        <Link
                            className="btn btn--primary landing-nav__register"
                            to="/register"
                        >
                            Create Account
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className="landing-hero">
                    <div className="landing-container landing-hero__inner">
                        <div className="landing-hero__content">
                            <p className="landing-eyebrow">
                                Your home, organized
                            </p>

                            <h1>
                                Never forget home maintenance again
                            </h1>

                            <p className="landing-hero__description">
                                Track appliances, repairs, warranties, costs, and
                                maintenance history for every home you own.
                            </p>

                            <div className="landing-hero__actions">
                                <Link
                                    className="btn btn--primary btn--lg"
                                    to="/register"
                                >
                                    Create Free Account
                                    <ArrowIcon />
                                </Link>

                                <Link
                                    className="btn btn--secondary btn--lg"
                                    to="/login"
                                >
                                    Log In
                                </Link>
                            </div>

                            <p className="landing-hero__note">
                                <span aria-hidden="true">✓</span>
                                Free to get started. No credit card required.
                            </p>
                        </div>

                        <div className="landing-hero__visual" aria-hidden="true">
                            <div className="hero-orbit hero-orbit--one" />
                            <div className="hero-orbit hero-orbit--two" />

                            <div className="hero-house">
                                <div className="hero-house__roof" />
                                <div className="hero-house__body">
                                    <div className="hero-house__window hero-house__window--left" />
                                    <div className="hero-house__window hero-house__window--right" />
                                    <div className="hero-house__door" />
                                </div>

                                <div className="hero-house__garage">
                                    <div className="hero-house__garage-roof" />
                                    <div className="hero-house__garage-body">
                                        <div className="hero-house__garage-door" />
                                    </div>
                                </div>

                                <div className="hero-house__chimney" />
                                <div className="hero-house__tree">
                                    <div className="hero-house__tree-top" />
                                    <div className="hero-house__tree-trunk" />
                                </div>

                                <div className="hero-house__ground" />
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="landing-primary-features"
                    id="features"
                    aria-labelledby="primary-features-title"
                >
                    <div className="landing-container">
                        <h2 className="sr-only" id="primary-features-title">
                            HomeKeeper features
                        </h2>

                        <div className="landing-primary-features__grid">
                            {primaryFeatures.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <article
                                        className="landing-feature-card"
                                        key={feature.title}
                                    >
                                        <div className="landing-feature-card__icon">
                                            <Icon />
                                        </div>

                                        <div>
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="landing-product" id="about">
                    <div className="landing-container landing-product__inner">
                        <div className="landing-product__content">
                            <p className="landing-eyebrow">
                                One source of truth
                            </p>

                            <h2>Everything about your home in one place</h2>

                            <p>
                                From assets and purchase details to repairs and
                                maintenance history, HomeKeeper helps you stay
                                organized and protect your investment.
                            </p>

                            <ul className="landing-product__list">
                                <li>Organize multiple homes</li>
                                <li>Track every important asset</li>
                                <li>Record repairs and maintenance</li>
                                <li>Keep costs and identifying details together</li>
                            </ul>
                        </div>

                        <div className="product-preview">
                            <aside className="product-preview__sidebar">
                                <div className="product-preview__brand">
                                    <HomeIcon />
                                    <span>HomeKeeper</span>
                                </div>

                                <div className="product-preview__nav">
                                    <span className="product-preview__nav-item product-preview__nav-item--active">
                                        <HomeIcon />
                                        Dashboard
                                    </span>

                                    <span className="product-preview__nav-item">
                                        <HomeIcon />
                                        Homes
                                    </span>

                                    <span className="product-preview__nav-item">
                                        <ToolsIcon />
                                        Assets
                                    </span>

                                    <span className="product-preview__nav-item">
                                        <CalendarIcon />
                                        Maintenance
                                    </span>
                                </div>
                            </aside>

                            <div className="product-preview__main">
                                <div className="product-preview__heading">
                                    <div>
                                        <span className="product-preview__label">
                                            Overview
                                        </span>
                                        <h3>Dashboard</h3>
                                    </div>

                                    <span className="product-preview__date">
                                        Home summary
                                    </span>
                                </div>

                                <div className="product-preview__stats">
                                    <div className="preview-stat">
                                        <span>Homes</span>
                                        <strong>2</strong>
                                    </div>

                                    <div className="preview-stat">
                                        <span>Assets</span>
                                        <strong>12</strong>
                                    </div>

                                    <div className="preview-stat">
                                        <span>Maintenance</span>
                                        <strong>8</strong>
                                    </div>

                                    <div className="preview-stat">
                                        <span>Total Value</span>
                                        <strong>$8.4k</strong>
                                    </div>
                                </div>

                                <div className="product-preview__panels">
                                    <section className="preview-panel">
                                        <div className="preview-panel__header">
                                            <h4>Recent Assets</h4>
                                            <span>View all</span>
                                        </div>

                                        <div className="preview-record">
                                            <span className="preview-record__icon">
                                                ❄
                                            </span>

                                            <div>
                                                <strong>Air Conditioner</strong>
                                                <span>Outside</span>
                                            </div>
                                        </div>

                                        <div className="preview-record">
                                            <span className="preview-record__icon">
                                                ◇
                                            </span>

                                            <div>
                                                <strong>Water Heater</strong>
                                                <span>Basement</span>
                                            </div>
                                        </div>

                                        <div className="preview-record">
                                            <span className="preview-record__icon">
                                                ▦
                                            </span>

                                            <div>
                                                <strong>Dishwasher</strong>
                                                <span>Kitchen</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="preview-panel">
                                        <div className="preview-panel__header">
                                            <h4>Maintenance History</h4>
                                            <span>View all</span>
                                        </div>

                                        <div className="preview-task">
                                            <div>
                                                <strong>HVAC inspection</strong>
                                                <span>Air Conditioner</span>
                                            </div>

                                            <span className="preview-task__status">
                                                Complete
                                            </span>
                                        </div>

                                        <div className="preview-task">
                                            <div>
                                                <strong>Water heater flush</strong>
                                                <span>Water Heater</span>
                                            </div>

                                            <span className="preview-task__status">
                                                Complete
                                            </span>
                                        </div>

                                        <div className="preview-task">
                                            <div>
                                                <strong>Filter replacement</strong>
                                                <span>Furnace</span>
                                            </div>

                                            <span className="preview-task__status">
                                                Complete
                                            </span>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-benefits">
                    <div className="landing-container">
                        <div className="landing-section-heading">
                            <p className="landing-eyebrow">
                                Simple by design
                            </p>

                            <h2>Built to make home maintenance easier</h2>

                            <p>
                                Keep the information homeowners usually scatter
                                across receipts, notes, manuals, and memory in one
                                organized system.
                            </p>
                        </div>

                        <div className="landing-benefits__grid">
                            {additionalFeatures.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <article
                                        className="landing-benefit"
                                        key={feature.title}
                                    >
                                        <div className="landing-benefit__icon">
                                            <Icon />
                                        </div>

                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta__inner">
                            <div>
                                <p className="landing-eyebrow">
                                    Get started today
                                </p>

                                <h2>
                                    Ready to protect your home and your investment?
                                </h2>

                                <p>
                                    Create your account and start organizing your
                                    home maintenance information.
                                </p>
                            </div>

                            <div className="landing-cta__actions">
                                <div className="landing-cta__buttons">
                                    <Link
                                        className="btn btn--primary btn--lg"
                                        to="/register"
                                    >
                                        Create Free Account
                                        <ArrowIcon />
                                    </Link>

                                    <Link
                                        className="btn btn--secondary btn--lg"
                                        to="/login"
                                    >
                                        Log In
                                    </Link>
                                </div>

                                <p>
                                    <span aria-hidden="true">✓</span>
                                    Free to get started. No credit card required.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-container landing-footer__inner">
                    <p>
                        © {new Date().getFullYear()} HomeKeeper. Home Maintenance
                        Tracker.
                    </p>

                    <div className="landing-footer__links">
                        <a href="#features">Features</a>
                        <Link to="/login">Log In</Link>
                        <Link to="/register">Create Account</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}