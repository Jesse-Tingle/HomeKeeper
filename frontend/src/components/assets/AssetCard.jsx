import { Link } from "react-router-dom";

export default function AssetCard({ asset }) {
    const formatPurchaseCost = (cost) => {
        if (cost === null || cost === undefined || cost === "") {
            return "Not specified";
        }

        return Number(cost).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    return (
        <article className="asset-card">
            <div className="asset-card__header">
                <div>
                    <h3 className="asset-card__title">{asset.name}</h3>

                    {asset.location && (
                        <p className="asset-card__location">{asset.location}</p>
                    )}
                </div>

                {asset.category && (
                    <span className="badge">{asset.category}</span>
                )}
            </div>

            <dl className="asset-card__details">
                <div className="asset-card__detail">
                    <dt>Manufacturer</dt>
                    <dd>{asset.manufacturer || "Not specified"}</dd>
                </div>

                <div className="asset-card__detail">
                    <dt>Model</dt>
                    <dd>{asset.model_number || "Not specified"}</dd>
                </div>

                <div className="asset-card__detail">
                    <dt>Serial</dt>
                    <dd>{asset.serial_number || "Not specified"}</dd>
                </div>

                <div className="asset-card__detail">
                    <dt>Purchase Cost</dt>
                    <dd>{formatPurchaseCost(asset.purchase_cost)}</dd>
                </div>
            </dl>

            <div className="asset-card__footer">
                <Link
                    className="btn btn--secondary btn--sm"
                    to={`/assets/${asset.id}`}
                >
                    View Details
                </Link>
            </div>
        </article>
    );
}