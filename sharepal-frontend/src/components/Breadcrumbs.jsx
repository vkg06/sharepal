export default function Breadcrumbs({ city }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href="/">{city}</a>
      <span aria-hidden>›</span>
      <strong>Gaming on rent</strong>
    </nav>
  );
}
