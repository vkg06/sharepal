export default function Sidebar({ items, active, onPick }) {
  return (
    <aside className="side" aria-label="Sub categories">
      {items.map((item) => (
        <button
          key={item.id}
          className={`side__item ${active === item.id ? "is-active" : ""}`}
          onClick={() => onPick(item.id)}
        >
          <span className="side__tile" aria-hidden>{item.icon}</span>
          <span className="side__label">{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
