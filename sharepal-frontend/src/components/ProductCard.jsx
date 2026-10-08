import { useState } from "react";

const formatRupees = (n) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const formatBooked = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : String(n));

export default function ProductCard({
  product, index, rentalDays, isSaved, onToggleSave, onNotify, onVote, onRent, priceTotal,
}) {
  const [loaded, setLoaded] = useState(false);
  const { name, image, rating, booked_count, tag, per_day_rent, out_of_stock } = product;

  const isVote = tag === "Vote to Launch";
  const tagClass = tag ? `tag--${tag.toLowerCase().replace(/\s+/g, "-")}` : "";

  return (
    <li
      className={`card ${out_of_stock ? "card--soldout" : ""}`}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className={`card__media ${loaded ? "is-loaded" : ""}`}>
        {tag && <span className={`tag ${tagClass}`}>{tag}</span>}

        <button
          className={`heart ${isSaved ? "heart--on" : ""}`}
          onClick={onToggleSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save for later"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.3 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
          </svg>
        </button>

        <img
          src={image}
          alt={`${name} on rent`}
          loading={index < 4 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.currentTarget.style.visibility = "hidden"; setLoaded(true); }}
        />
        {out_of_stock && <div className="card__sold">Out of stock</div>}
      </div>

      <div className="card__body">
        <h3 className="card__title" title={name}>{name}</h3>

        <div className="card__meta">
          {rating > 0 ? (
            <span className="rating">★ {rating.toFixed(1)}</span>
          ) : (
            <span className="rating rating--new">New</span>
          )}
          <span>{formatBooked(booked_count)}{isVote ? " votes" : " booked"}</span>
        </div>

        <div className="card__foot">
          <p className="price">
            <strong>{formatRupees(per_day_rent)}</strong><small>/day</small>
            {rentalDays > 0 && !isVote && (
              <span className="price__total">
                {formatRupees(priceTotal ?? per_day_rent * rentalDays)} for {rentalDays} {rentalDays === 1 ? "day" : "days"}
              </span>
            )}
          </p>

          {isVote ? (
            <button className="btn btn--outline" onClick={onVote}>Vote</button>
          ) : out_of_stock ? (
            <button className="btn btn--ghost" onClick={onNotify}>Notify me</button>
          ) : (
            <button className="btn btn--primary" onClick={onRent}>Rent now</button>
          )}
        </div>
      </div>
    </li>
  );
}
