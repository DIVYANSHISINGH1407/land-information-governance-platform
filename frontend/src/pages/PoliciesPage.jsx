import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStoredPolicies } from "../data/policyStorage";

const jurisdictions = [
  "All jurisdictions",
  "National",
  "Uttar Pradesh",
  "Maharashtra",
  "Madhya Pradesh",
  "Rajasthan",
];

const categories = [
  "All categories",
  "Land Acquisition",
  "Land Revenue",
  "Forest Conservation",
  "Agricultural Land",
  "Land Reforms",
  "Urban Land",
];

// Helper to check if a Government Official is currently logged in
function getLoggedInUser() {
  const saved =
    localStorage.getItem("bhumisetu-demo-user") ||
    localStorage.getItem("bhoomisetu-demo-user");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export default function PoliciesPage() {
  // 1. Shared Policies State (reads from the exact same storage as GovernmentPolicies)
  const [policies, setPolicies] = useState(getStoredPolicies);

  // 2. Search and Filter States
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [category, setCategory] = useState("All categories");

  // 3. View Details Modal State (Read-only)
  const [detail, setDetail] = useState(null);

  // 4. Current user session (for showing link to Gov portal if official is logged in)
  const currentUser = getLoggedInUser();

  // Listen for storage updates if changes happen in another tab or window
  useEffect(() => {
    function handleStorageUpdate(event) {
      if (event.key === "bhumisetu-policies") {
        setPolicies(getStoredPolicies());
      }
    }
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const isGovernmentOfficial = currentUser && currentUser.role === "government";

  // Filter policies based on search query, jurisdiction and category
  const results = policies.filter(
    (item) =>
      (jurisdiction === "All jurisdictions" || item.jurisdiction === jurisdiction) &&
      (category === "All categories" || item.category === category) &&
      `${item.title} ${item.authority} ${item.description} ${item.category} ${item.jurisdiction}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  return (
    <main className="inner-page library-page">
      {/* Optional banner if a Government Official is visiting the public page */}
      {isGovernmentOfficial && (
        <aside className="gov-official-notice-banner">
          <span>🛡️ Signed in as Government Official:</span> You are viewing the public directory.
          To add, edit or delete policies, visit the{" "}
          <Link to="/government/policies">Government Policy Management Portal →</Link>
        </aside>
      )}

      {/* Hero Header */}
      <section className="library-hero policy-hero">
        <span className="overline">PUBLIC POLICY DIRECTORY</span>
        <h1>Land Policies</h1>
        <p>Find policy references related to land administration, conservation and planning.</p>
      </section>

      {/* Search and Filters */}
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

      {/* Results Heading */}
      <div className="library-results-heading">
        <div>
          <span className="overline">POLICY COLLECTION</span>
          <h2>
            {results.length} {results.length === 1 ? "document" : "documents"}
          </h2>
        </div>
        <span className="demo-label">SAMPLE DIRECTORY</span>
      </div>

      {/* Policy List */}
      {results.length ? (
        <section className="policy-list">
          {results.map((item) => (
            <article className="policy-row" key={item.id || item.title}>
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
              <button
                type="button"
                className="detail-link"
                onClick={() => setDetail(item)}
              >
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

      {/* Read-Only View Details Modal */}
      {detail && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDetail(null)}>
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="public-policy-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDetail(null)} aria-label="Close">
              ×
            </button>
            <span className="category-label">
              {detail.category} · {detail.jurisdiction} · {detail.year}
            </span>
            <h2 id="public-policy-modal-title">{detail.title}</h2>
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
