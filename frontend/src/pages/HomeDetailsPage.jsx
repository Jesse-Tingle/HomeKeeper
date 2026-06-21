import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient from "../api/apiClient";

export default function HomeDetailsPage() {
    const { id } = useParams();

    const [home, setHome] = useState(null);
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <p>Loading home details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!home) {
        return <p>Home not found.</p>;
    }

    return (
        <main>
            <Link to="/">← Back to Dashboard</Link>

            <section>
                <h1>{home.name}</h1>

                <p>
                    {home.street_address}, {home.city}, {home.state}{" "}
                    {home.postal_code}
                </p>

                <p>Type: {home.type || "Not specified"}</p>
            </section>

            <section>
                <h2>Assets</h2>

                {assets.length === 0 ? (
                    <p>No assets have been added to this home yet.</p>
                ) : (
                    <ul>
                        {assets.map((asset) => (
                            <li key={asset.id}>
                                <h3>{asset.name}</h3>
                                <p>Category: {asset.category}</p>
                                <p>Location: {asset.location || "Not specified"}</p>
                                <p>Manufacturer: {asset.manufacturer || "Not specified"}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}