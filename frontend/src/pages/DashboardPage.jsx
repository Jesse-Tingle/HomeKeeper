import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Authenticated: {String(isAuthenticated)}</p>

            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    );
}