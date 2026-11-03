import { Link } from "react-router-dom";

const features = [
  {
    icon: "◈",
    title: "Explore Land Data",
    description: "Browse regional land classification and ownership information.",
    to: "/explore",
    action: "Explore land",
  },
  {
    icon: "▥",
    title: "Visual Analytics",
    description: "Understand land patterns through clear, interactive charts.",
    to: "/explore",
    action: "View dashboard",
  },
  {
    icon: "▤",
    title: "Research & Reports",
    description: "Find studies and publications about land and governance.",
    to: "/research",
    action: "Browse research",
  },
  {
    icon: "§",
    title: "Land Policies",
    description: "Discover policy references by topic and jurisdiction.",
    to: "/policies",
    action: "View policies",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="overline">LAND INFORMATION &amp; GOVERNANCE</span>
          <h1>
            One Platform.
            <br />
            <em>Complete Land Insight.</em>
          </h1>
          <p>
            Explore land information, research and policies across states and districts — all in one
            place.
          </p>
          <Link className="primary-button" to="/explore">
            Explore Land <span>→</span>
          </Link>
        </div>
        <div
          className="hero-photo"
          role="img"
          aria-label="Green agricultural fields across the landscape"
        />
        <div className="hero-caption">Land information, brought into view</div>
      </section>
      <section className="home-features">
        <div className="section-intro">
          <span className="overline">A CLEARER VIEW OF LAND</span>
          <h2>
            Find the information
            <br />
            that moves you forward.
          </h2>
        </div>
        <div className="feature-grid">
          {features.map((item) => (
            <Link to={item.to} className="feature-tile" key={item.title}>
              <span className="feature-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="feature-action">
                {item.action} <i>→</i>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-overview">
        <div className="home-overview-heading">
          <span className="overline">FROM LAND DATA TO CONTEXT</span>
          <h2>Start with a place. Find the information around it.</h2>
          <p>
            BhumiSetu brings regional land information, research and policy references into one
            easy-to-explore experience.
          </p>
        </div>
        <div className="home-overview-cards">
          <article>
            <span>01</span>
            <h3>Choose an area</h3>
            <p>Select a state or a district to view the available land overview.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Understand land use</h3>
            <p>Compare categories such as agricultural, forest and residential land.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Explore the context</h3>
            <p>Continue to related research, reports and land policy references.</p>
          </article>
        </div>
      </section>
      <section className="home-closing">
        <span className="closing-leaf">✳</span>
        <p>
          Building a more informed and sustainable
          <br className="desktop-only" /> land future.
        </p>
        <Link to="/about">
          Our mission <span>→</span>
        </Link>
      </section>
    </main>
  );
}
