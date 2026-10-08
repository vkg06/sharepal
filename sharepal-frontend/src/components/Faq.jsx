import { useState } from "react";
import { Chevron } from "./icons.jsx";

export default function Faq({ faqs = [], moreFaqs = [] }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? [...faqs, ...moreFaqs] : faqs;

  return (
    <section className="faq-card">
      <h2>Frequently Asked Questions (FAQs)</h2>

      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`faq__item ${isOpen ? "is-open" : ""}`} key={item.q}>
            <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? -1 : i)}>
              {item.q}
              <span className="faq__chev" aria-hidden><Chevron /></span>
            </button>
            <div className="faq__a"><p>{item.a}</p></div>
          </div>
        );
      })}

      {!showAll && (
        <button className="faq__more" onClick={() => setShowAll(true)}>View more FAQ's</button>
      )}
    </section>
  );
}
