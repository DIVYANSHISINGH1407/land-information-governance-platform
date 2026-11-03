import { useState } from "react";
import { policyItems } from "../data/mockData";

const jurisdictions = ["All jurisdictions", "National", "Uttar Pradesh", "Maharashtra"];
const categories = [
  "All categories",
  "Land Acquisition",
  "Land Revenue",
  "Forest Conservation",
  "Agricultural Land",
  "Land Reforms",
  "Urban Land",
];
export default function PoliciesPage() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [category, setCategory] = useState("All categories");
  const [detail, setDetail] = useState(null);

  // Match the search text, jurisdiction and category filters.
  const results = policyItems.filter(
    (item) =>
      (jurisdiction === "All jurisdictions" || item.jurisdiction === jurisdiction) &&
      (category === "All categories" || item.category === category) &&
      `${item.title} ${item.authority} ${item.description} ${item.category} ${item.jurisdiction}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="inner-page library-page">
      <section className="library-hero policy-hero">
        <span className="overline">PUBLIC POLICY DIRECTORY</span>
        <h1>Land Policies</h1>
        <p>Find policy references related to land administration, conservation and planning.</p>
      </section>
      <section className="policy-filters">
        <label className="library-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies, authorities or topics…"
            aria-label="Search policies"
          />
        </label>
        <label>
          <span>JURISDICTION</span>
          <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}>
            {jurisdictions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>POLICY CATEGORY</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>
      <div className="library-results-heading">
        <div>
          <span className="overline">POLICY COLLECTION</span>
          <h2>
            {results.length} {results.length === 1 ? "document" : "documents"}
          </h2>
        </div>
        <span className="demo-label">SAMPLE DIRECTORY</span>
      </div>
      {results.length ? (
        <section className="policy-list">
          {results.map((item) => (
            <article className="policy-row" key={item.title}>
              <span className="document-icon">▤</span>
              <div className="policy-main">
                <span className="category-label">
                  {item.category} · {item.jurisdiction}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div>
                  {item.authority} <i>·</i> {item.year}
                </div>
              </div>
              <button className="detail-link" onClick={() => setDetail(item)}>
                View Details <span>→</span>
              </button>
            </article>
          ))}
        </section>
      ) : (
        <div className="library-empty">
          <span>⌕</span>
          <h3>No policies found</h3>
          <p>Change your search or filter selection to see more results.</p>
          <button
            onClick={() => {
              setQuery("");
              setJurisdiction(jurisdictions[0]);
              setCategory(categories[0]);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <p className="data-disclaimer">
        Policy summaries are illustrative and may not reflect current law. Refer to official
        gazettes and government publications for authoritative text.
      </p>
      {detail && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDetail(null)}>
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDetail(null)} aria-label="Close">
              ×
            </button>
            <span className="category-label">
              {detail.category} · {detail.jurisdiction} · {detail.year}
            </span>
            <h2 id="policy-modal-title">{detail.title}</h2>
            <p>{detail.description}</p>
            <div className="modal-publisher">
              Issuing authority <b>{detail.authority}</b>
            </div>
            <div className="modal-sample-note">
              The official document link is not connected in this prototype. Verify the current text
              with the issuing authority.
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
