const COLUMNS = [
  { title: "Sharepal", links: ["About", "Why SharePal", "Sitemap", "CarePal"] },
  {
    title: "Become a Pal",
    links: ["Sharepal for Creators", "Careers", "Sharepal for Brands", { label: "Asset Funding Program", isNew: true }, { label: "Rent Your Gear", isNew: true }],
  },
  { title: "Information", links: ["How it works?", "FAQs", "Verification", "Cancellation Policy", "Life at Sharepal"] },
  { title: "Policies", links: ["Terms & Condition", "Shipping policy", "Damage Policy", "Terms of Use", "Privacy Policy"] },
];

const goUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

function Socials() {
  return (
    <div className="socials">
      <a href="#" aria-label="Facebook">
        <svg width="34" height="34" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="currentColor" /><path fill="#000b2e" d="M13.5 21v-7h2.3l.4-3h-2.7V9.4c0-.8.3-1.4 1.4-1.4h1.4V5.3A15 15 0 0 0 15.3 5c-2.1 0-3.6 1.3-3.6 3.7V11H9.4v3h2.3v7z" /></svg>
      </a>
      <a href="#" aria-label="Instagram">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="2" y="2" width="20" height="20" rx="6" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.6" cy="6.4" r="1" fill="currentColor" /></svg>
      </a>
      <a href="#" aria-label="LinkedIn">
        <svg width="34" height="34" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="currentColor" /><path fill="#000b2e" d="M6.5 9.5h2.6V18H6.5zM7.8 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11 9.5h2.5v1.1c.4-.7 1.3-1.3 2.7-1.3 2.7 0 3.3 1.7 3.3 4V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V18H11z" /></svg>
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="foot container">
      <div className="foot__logo"><span>Share</span><em>Pal</em></div>

      <div className="foot__grid">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h5>{col.title}</h5>
            <ul>
              {col.links.map((link) => {
                const { label, isNew } = typeof link === "string" ? { label: link } : link;
                return (
                  <li key={label}>
                    <a href="#">{label}</a>
                    {isNew && <span className="foot__badge">New</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="foot__help">
          <h5>Need Help</h5>
          <ul>
            <li>
              <a href="#">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /></svg>
                Contact Support
              </a>
            </li>
            <li><a href="#">Contact Us</a></li>
            <li>
              <a href="mailto:care@sharepal.in">
                <svg width="26" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="m3 7 9 6.5L21 7" /></svg>
                care@sharepal.in
              </a>
            </li>
          </ul>
          <Socials />
        </div>
      </div>

      <div className="foot__bar">
        <button onClick={goUp}>
          Go up
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <span>© {new Date().getFullYear()} SharePal · Frontend assignment recreation</span>
        <span>Made with <span className="foot__heart">♥</span> for India</span>
      </div>
    </footer>
  );
}
