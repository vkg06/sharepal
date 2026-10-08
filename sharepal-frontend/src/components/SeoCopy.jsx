import { useState } from "react";
import { Chevron } from "./icons.jsx";

export default function SeoCopy({ city, data }) {
  const [expanded, setExpanded] = useState(false);
  const replaceCity = text => text.replaceAll("{city}", city);
  return (
    <div className="seo container">
      <h4 className="seo__title">{replaceCity(data.title)}</h4>
      <p>{replaceCity(data.intro)}</p>
      <h4 className="seo__heading">{data.categoryTitle}</h4>
      <a href="#" className="seo__link" onClick={(e) => e.preventDefault()}>{data.categoryLink}</a>
      <p>{data.categoryText}</p>
      {expanded && <><a href="#" className="seo__link" onClick={(e) => e.preventDefault()}>{data.gamingLink}</a><p>{replaceCity(data.gamingText)}</p></>}
      <button className="seo__more" onClick={() => setExpanded(v => !v)} aria-expanded={expanded}>
        {expanded ? "Read Less" : "Read More"}<span className={expanded ? "is-flipped" : ""}><Chevron size={14} /></span>
      </button>
    </div>
  );
}
