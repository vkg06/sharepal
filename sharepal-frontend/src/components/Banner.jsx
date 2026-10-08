export default function Banner({ city }) {
  return (
    <section className="banner">
      <span className="banner__art banner__art--left" aria-hidden>🎮</span>
      <div className="banner__copy">
        <h2>Gaming</h2>
        <p>
          Rent PS5 consoles, games &amp; accessories from <b className="banner__brand">SharePal</b> in {city}.
          <br />FC26, God of War, Spider-Man, racing wheels and more on rent.
        </p>
        <ul className="banner__chips">
          <li>PlayStation 5</li><li>EA Sports FC</li><li>Digital games</li><li>Controllers</li>
        </ul>
      </div>
      <span className="banner__art banner__art--right" aria-hidden>🕹️</span>
    </section>
  );
}
