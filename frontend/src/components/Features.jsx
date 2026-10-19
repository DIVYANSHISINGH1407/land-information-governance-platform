// Simple array of objects. Each object is one feature card.
const features = [
  {
    id: "land-info",
    title: "Land Information",
    description:
      "Explore land information by state, district and land type through a clear, organized interface.",
    // Pin icon: circle + small rectangle tip
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="9" r="2" fill="currentColor" />
        <rect x="11" y="14" width="2" height="6" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "statistics",
    title: "Land-use Statistics",
    description:
      "Understand land-cover classes and area distributions using available land-use data.",
    // Bar chart icon: 3 tall rectangles + 1 base line
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="3" height="9" rx="1" fill="currentColor" />
        <rect x="10.5" y="5" width="3" height="14" rx="1" fill="currentColor" />
        <rect x="17" y="8" width="3" height="11" rx="1" fill="currentColor" />
        <rect x="3" y="19" width="18" height="1.5" rx="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "policies",
    title: "Policies & Research",
    description:
      "Discover government policies and research related to land governance and planning.",
    // Document icon: paper rectangle + 2 text lines
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <rect x="9" y="8" width="6" height="1.5" rx="0.75" fill="currentColor" />
        <rect x="9" y="12" width="6" height="1.5" rx="0.75" fill="currentColor" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Platform features</p>
          <h2 className="section-title">Built for clearer land insight</h2>
          <p className="section-desc">
            Three focused spaces to explore land information, patterns and related
            knowledge — without clutter or noise.
          </p>
        </div>

        <div className="features-grid">
          {/*
            .map() goes through each item in the features array
            and returns one card for each item.
          */}
          {features.map((feature) => (
            <article key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
