const asItem = (link) => (typeof link === "string" ? { label: link } : link);

export default function CategoryLinks({ groups = [], onPick }) {
  return (
    <div className="cat-grid container">
      {groups.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.links.map(asItem).map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onPick(item); }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
