import { useState } from "react";
import { researchItems } from "../data/mockData";

const categories = [
  "All",
  "Agriculture",
  "Forestry",
  "Land Use",
  "Urban Development",
  "Environment",
  "Other",
];
export default function ResearchPage() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [detail, setDetail] = useState(null);
  // Show items that match both the selected category and the search text.
  const results = researchItems.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.description} ${item.publisher} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="inner-page library-page">
      <section className="library-hero research-hero">
        <span className="overline">KNOWLEDGE LIBRARY</span>
        <h1>Research &amp; Insights</h1>
        <p>Explore reports, papers and studies that illuminate land use and governance.</p>
      </section>
      <div className="library-tools">
        <label className="library-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research papers, topics or publishers…"
            aria-label="Search research"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>
        <div className="filter-chips" aria-label="Research categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="library-results-heading">
        <div>
          <span className="overline">RESEARCH COLLECTION</span>
          <h2>
            {results.length} {results.length === 1 ? "publication" : "publications"}
          </h2>
        </div>
        <span className="demo-label">SAMPLE CATALOGUE</span>
      </div>
      {results.length ? (
        <section className="research-grid">
          {results.map((item) => (
            <article className="research-card" key={item.title}>
              <div className="research-card-top">
                <span className="document-icon">▤</span>
                <span className="category-label">{item.category}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="publication-meta">
                {item.publisher}
                <span>·</span>
                {item.year}
              </div>
              <button className="detail-link" onClick={() => setDetail(item)}>
                Read More <span>→</span>
              </button>
            </article>
          ))}
        </section>
      ) : (
        <div className="library-empty">
          <span>⌕</span>
          <h3>No publications found</h3>
          <p>Try another search term or choose a different category.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <p className="data-disclaimer">
        Sample catalogue entries for demonstration. Titles and publisher information should be
        verified before release.
      </p>
      {detail && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDetail(null)}>
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDetail(null)} aria-label="Close">
              ×
            </button>
            <span className="category-label">
              {detail.category} · {detail.year}
            </span>
            <h2 id="modal-title">{detail.title}</h2>
            <p>{detail.description}</p>
            <div className="modal-publisher">
              Published by <b>{detail.publisher}</b>
            </div>
            <div className="modal-sample-note">
              A full text or source link is not attached to this sample catalogue entry.
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
