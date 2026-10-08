export default function Toolbar({
  query, onQuery, sort, onSort, inStockOnly, onInStockOnly, searchRef,
}) {
  return (
    <div className="toolbar">
      <div className="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search PS5, FC26, God of War…"
          aria-label="Search gaming gadgets"
        />
      </div>

      <label className="switch">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStockOnly(e.target.checked)} />
        <span className="switch__track" />
        In stock only
      </label>

      <label className="sort">
        <span>Sort by</span>
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          <option value="popular">Most booked</option>
          <option value="rating">Top rated</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
        </select>
      </label>
    </div>
  );
}
