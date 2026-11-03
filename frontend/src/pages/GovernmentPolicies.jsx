import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStoredPolicies, saveStoredPolicies } from "../data/policyStorage";

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

const CURRENT_YEAR = 2026;

// Helper to read the currently authenticated user from localStorage
function getAuthenticatedUser() {
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

export default function GovernmentPolicies() {
  // 1. Authentication State
  const [user, setUser] = useState(getAuthenticatedUser);

  // 2. Shared Policy Data State (initialized from policyStorage)
  const [policies, setPolicies] = useState(getStoredPolicies);

  // 3. Search and Filter States
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [category, setCategory] = useState("All categories");

  // 4. Modal and Dialog States
  const [detail, setDetail] = useState(null); // View Details modal
  const [showModal, setShowModal] = useState(null); // "add" | "edit" | null
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletingPolicy, setDeletingPolicy] = useState(null); // Delete confirmation modal

  // 5. Form input state for Add/Edit
  const [policyForm, setPolicyForm] = useState({
    title: "",
    authority: "",
    jurisdiction: "National",
    category: "Land Reforms",
    year: CURRENT_YEAR,
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Synchronize state if another tab or window updates policies
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

  // Check if current user is an authenticated Government Official
  const isGovernmentOfficial = user && user.role === "government";

  // Filter policies according to search query, jurisdiction and category
  const results = policies.filter(
    (item) =>
      (jurisdiction === "All jurisdictions" || item.jurisdiction === jurisdiction) &&
      (category === "All categories" || item.category === category) &&
      `${item.title} ${item.authority} ${item.description} ${item.category} ${item.jurisdiction}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  // Development-only testing helper: Activate demo government official session
  function handleDevSimulateLogin() {
    const demoOfficial = {
      name: "Dr. K. Sharma",
      email: "official@revenue.gov.in",
      role: "government",
      department: "Land Administration & Revenue Department",
    };
    localStorage.setItem("bhumisetu-demo-user", JSON.stringify(demoOfficial));
    setUser(demoOfficial);
  }

  // Sign out of demo government session
  function handleSignOut() {
    localStorage.removeItem("bhumisetu-demo-user");
    setUser(null);
  }

  // Open the Add Policy modal with clean fields
  function handleOpenAdd() {
    setFormErrors({});
    setEditingPolicy(null);
    setPolicyForm({
      title: "",
      authority: user?.department || "State Land Administration",
      jurisdiction: "National",
      category: "Land Reforms",
      year: CURRENT_YEAR,
      description: "",
    });
    setShowModal("add");
  }

  // Open the Edit Policy modal pre-filled with the selected policy's data
  function handleOpenEdit(item) {
    setFormErrors({});
    setEditingPolicy(item);
    setPolicyForm({
      title: item.title,
      authority: item.authority,
      jurisdiction: item.jurisdiction,
      category: item.category,
      year: item.year,
      description: item.description,
    });
    setShowModal("edit");
  }

  // Validate form before adding or updating
  function validateForm() {
    const errors = {};
    if (!policyForm.title.trim()) {
      errors.title = "Policy title is required.";
    }
    if (!policyForm.authority.trim()) {
      errors.authority = "Issuing authority is required.";
    }
    if (!policyForm.description.trim()) {
      errors.description = "Summary description is required.";
    }
    const parsedYear = Number(policyForm.year);
    if (!parsedYear || parsedYear < 1900 || parsedYear > 2100) {
      errors.year = "Please enter a valid year between 1900 and 2100.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Handle saving (Create new or Update existing)
  function handleSavePolicy(e) {
    e.preventDefault();
    if (!validateForm()) return;

    let updatedList;
    if (showModal === "add") {
      const newPolicy = {
        id: "policy-" + Date.now(),
        ...policyForm,
        year: Number(policyForm.year),
      };
      // Prepend the new policy to the list
      updatedList = [newPolicy, ...policies];
    } else {
      // Replace the edited policy in the list
      updatedList = policies.map((item) =>
        item === editingPolicy ||
        (editingPolicy.id && item.id === editingPolicy.id) ||
        item.title === editingPolicy.title
          ? { ...item, ...policyForm, year: Number(policyForm.year) }
          : item,
      );
    }

    // Save to shared localStorage and update local state
    saveStoredPolicies(updatedList);
    setPolicies(updatedList);
    setShowModal(null);
  }

  // Handle deleting a policy after confirmation
  function handleConfirmDelete() {
    if (!deletingPolicy) return;

    const updatedList = policies.filter(
      (item) =>
        item !== deletingPolicy &&
        !(deletingPolicy.id && item.id === deletingPolicy.id) &&
        item.title !== deletingPolicy.title,
    );

    // Save to shared localStorage and update local state
    saveStoredPolicies(updatedList);
    setPolicies(updatedList);
    setDeletingPolicy(null);
  }

  // -------------------------------------------------------------
  // VIEW 1: ACCESS RESTRICTED SCREEN (If not authenticated as Government)
  // -------------------------------------------------------------
  if (!isGovernmentOfficial) {
    return (
      <main className="inner-page library-page">
        <section className="library-hero policy-hero">
          <span className="overline">ACCESS CONTROL</span>
          <h1>Government Portal Restricted</h1>
          <p>
            This section is reserved exclusively for authenticated Government
            Officials to manage state and national land policies.
          </p>
        </section>

        <section className="access-restricted-box">
          <div className="restricted-icon">🔒</div>
          <h2>Official Authentication Required</h2>
          <p>
            You are currently{" "}
            <strong>
              {user ? `signed in as a ${user.role} user` : "not signed in"}
            </strong>
            . Administrative actions like adding, editing, and deleting policy
            records are restricted to verified government accounts.
          </p>

          <div className="restricted-actions">
            <Link to="/login/government" className="primary-button">
              Log in as Government Official <span>→</span>
            </Link>
            <Link to="/policies" className="secondary-button">
              View Public Policies Directory
            </Link>
          </div>

          {/* Development & College Presentation Testing Helper */}
          <div className="dev-testing-card">
            <span className="dev-tag">DEVELOPMENT &amp; EVALUATION TESTING ONLY</span>
            <p>
              In this prototype phase, government account creation requires manual
              verification. Click below to simulate an active Government Official session:
            </p>
            <button
              type="button"
              className="dev-login-btn"
              onClick={handleDevSimulateLogin}
            >
              Simulate Government Official Login (Demo)
            </button>
          </div>
        </section>
      </main>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED GOVERNMENT OFFICIAL MANAGEMENT PORTAL
  // -------------------------------------------------------------
  return (
    <main className="inner-page library-page">
      {/* Government Official Hero Banner */}
      <section className="library-hero policy-hero gov-portal-hero">
        <div className="gov-hero-header">
          <div>
            <span className="overline">GOVERNMENT ADMINISTRATION PORTAL</span>
            <h1>Land Policy Management</h1>
            <p>
              Add, review, edit, and delete official land policies. All modifications
              are saved to the shared directory and immediately reflected on the public portal.
            </p>
          </div>

          <div className="gov-session-card">
            <span className="gov-status-dot">●</span>
            <div>
              <b>{user.name}</b>
              <small>Government Official · {user.email}</small>
            </div>
            <button
              type="button"
              className="gov-signout-btn"
              onClick={handleSignOut}
              title="Sign out of government session"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="policy-filters">
        <label className="library-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies by title, authority or keywords…"
            aria-label="Search policies"
          />
        </label>
        <label>
          <span>JURISDICTION</span>
          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          >
            {jurisdictions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>POLICY CATEGORY</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      {/* Policy Collection Header & "+ Add New Policy" Button */}
      <div className="library-results-heading">
        <div>
          <span className="overline">POLICY ADMINISTRATION</span>
          <h2>
            {results.length} {results.length === 1 ? "document" : "documents"} under management
          </h2>
        </div>

        <div className="policy-heading-controls">
          <button
            type="button"
            className="add-policy-btn"
            onClick={handleOpenAdd}
          >
            + Add New Policy
          </button>
          <span className="demo-label">OFFICIAL PORTAL</span>
        </div>
      </div>

      {/* Policy List with Edit and Delete Controls */}
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

              <div className="policy-card-actions">
                <div className="policy-admin-actions">
                  <button
                    type="button"
                    className="policy-action-btn edit-btn"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit policy"
                    aria-label={`Edit ${item.title}`}
                  >
                    ✎ Edit
                  </button>
                  <button
                    type="button"
                    className="policy-action-btn delete-btn"
                    onClick={() => setDeletingPolicy(item)}
                    title="Delete policy"
                    aria-label={`Delete ${item.title}`}
                  >
                    🗑 Delete
                  </button>
                </div>

                <button
                  type="button"
                  className="detail-link"
                  onClick={() => setDetail(item)}
                >
                  View Details <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="library-empty">
          <span>⌕</span>
          <h3>No policies match your filters</h3>
          <p>Try clearing filters or add a new policy to the directory.</p>
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

      {/* Public directory quick link */}
      <div className="gov-footer-note">
        <span>💡 Public sync active:</span> Any policy changes made here are saved
        to <code>"bhumisetu-policies"</code> and are immediately visible to public users on{" "}
        <Link to="/policies">the Public Policies Page</Link>.
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: VIEW DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      {detail && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setDetail(null)}
        >
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gov-policy-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setDetail(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="category-label">
              {detail.category} · {detail.jurisdiction} · {detail.year}
            </span>
            <h2 id="gov-policy-detail-title">{detail.title}</h2>
            <p>{detail.description}</p>
            <div className="modal-publisher">
              Issuing authority <b>{detail.authority}</b>
            </div>
            <div className="modal-sample-note">
              Government Official record view. Official gazette and document storage
              integration will connect to PostgreSQL in the backend phase.
            </div>
          </section>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD / EDIT POLICY MODAL FORM */}
      {/* ------------------------------------------------------------- */}
      {showModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowModal(null)}
        >
          <section
            className="detail-modal policy-modal-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gov-form-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="category-label">
              {showModal === "add"
                ? "GOVERNMENT PORTAL · NEW POLICY ENTRY"
                : "GOVERNMENT PORTAL · EDIT POLICY RECORD"}
            </span>
            <h2 id="gov-form-heading">
              {showModal === "add" ? "Add New Land Policy" : "Edit Land Policy"}
            </h2>

            <form onSubmit={handleSavePolicy} className="policy-edit-form">
              <label className="policy-form-field">
                <span>Policy Title *</span>
                <input
                  type="text"
                  value={policyForm.title}
                  onChange={(e) =>
                    setPolicyForm({ ...policyForm, title: e.target.value })
                  }
                  placeholder="e.g. National Land Use Policy Framework"
                />
                {formErrors.title && (
                  <small className="form-error-msg">{formErrors.title}</small>
                )}
              </label>

              <div className="policy-form-grid">
                <label className="policy-form-field">
                  <span>Issuing Authority *</span>
                  <input
                    type="text"
                    value={policyForm.authority}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, authority: e.target.value })
                    }
                    placeholder="e.g. Ministry of Rural Development"
                  />
                  {formErrors.authority && (
                    <small className="form-error-msg">
                      {formErrors.authority}
                    </small>
                  )}
                </label>

                <label className="policy-form-field">
                  <span>Year *</span>
                  <input
                    type="number"
                    value={policyForm.year}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, year: e.target.value })
                    }
                    placeholder="YYYY"
                  />
                  {formErrors.year && (
                    <small className="form-error-msg">{formErrors.year}</small>
                  )}
                </label>
              </div>

              <div className="policy-form-grid">
                <label className="policy-form-field">
                  <span>Jurisdiction</span>
                  <select
                    value={policyForm.jurisdiction}
                    onChange={(e) =>
                      setPolicyForm({
                        ...policyForm,
                        jurisdiction: e.target.value,
                      })
                    }
                  >
                    <option value="National">National</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </label>

                <label className="policy-form-field">
                  <span>Category</span>
                  <select
                    value={policyForm.category}
                    onChange={(e) =>
                      setPolicyForm({ ...policyForm, category: e.target.value })
                    }
                  >
                    {categories
                      .filter((c) => c !== "All categories")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <label className="policy-form-field">
                <span>Policy Summary *</span>
                <textarea
                  rows={3}
                  value={policyForm.description}
                  onChange={(e) =>
                    setPolicyForm({ ...policyForm, description: e.target.value })
                  }
                  placeholder="Key scope, objectives and regulatory provisions..."
                />
                {formErrors.description && (
                  <small className="form-error-msg">
                    {formErrors.description}
                  </small>
                )}
              </label>

              <div className="policy-modal-footer">
                <button
                  type="button"
                  className="policy-btn-cancel"
                  onClick={() => setShowModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="policy-btn-save">
                  {showModal === "add" ? "Create Policy" : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: CONFIRM DELETE DIALOG */}
      {/* ------------------------------------------------------------- */}
      {deletingPolicy && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setDeletingPolicy(null)}
        >
          <section
            className="detail-modal delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gov-delete-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setDeletingPolicy(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="category-label delete-badge-label">
              CONFIRM DELETION
            </span>
            <h2 id="gov-delete-title">Delete Land Policy</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{deletingPolicy.title}"</strong>?
              This policy record will be removed from both this portal and the
              public directory.
            </p>
            <div className="policy-modal-footer">
              <button
                type="button"
                className="policy-btn-cancel"
                onClick={() => setDeletingPolicy(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="policy-btn-danger"
                onClick={handleConfirmDelete}
              >
                Yes, Delete Policy
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
