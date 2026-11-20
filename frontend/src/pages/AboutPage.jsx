import { Link } from "react-router-dom";

const objectives = [
  "Bring land information into one organized place",
  "Make regional land patterns easier to understand",
  "Connect land records with research and policy references",
  "Support transparent, informed land governance",
];
export default function AboutPage() {
  return (
    <main className="inner-page about-page">
      <section className="about-hero">
        <div>
          <span className="overline">ABOUT BHUMISETU</span>
          <h1>
            Bridging the gap between
            <br />
            <em>land data and people.</em>
          </h1>
          <p>
            BhumiSetu is a centralized platform concept for discovering land-related information,
            research and public policy in one accessible place.
          </p>
          <Link className="primary-button" to="/explore">
            Explore the platform <span>→</span>
          </Link>
        </div>
        <div className="about-photo" role="img" aria-label="Agricultural landscape" />
      </section>
      <section className="about-mission">
        <article>
          <span className="overline">THE CHALLENGE</span>
          <h2>
            Information scattered
            <br />
            across many sources.
          </h2>
          <p>
            Land records, classification, research and policies are often published in different
            places and formats. Finding enough context to understand a particular area can take
            time.
          </p>
        </article>
        <article>
          <span className="overline">OUR MISSION</span>
          <h2>
            Make land information
            <br />
            clearer and connected.
          </h2>
          <p>
            We are building a single point of discovery that helps people browse land data,
            understand regional patterns and find related knowledge.
          </p>
        </article>
      </section>
      <section className="vision-band">
        <span>✳</span>
        <div>
          <span className="overline">OUR VISION</span>
          <h2>A well-informed, transparent and sustainable land governance ecosystem.</h2>
        </div>
      </section>
      <section className="objectives-section">
        <div className="section-intro">
          <span className="overline">WHAT WE ARE WORKING TOWARD</span>
          <h2>Project objectives</h2>
        </div>
        <ol>
          {objectives.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              <b>{item}</b>
            </li>
          ))}
        </ol>
      </section>
      <section className="project-facts">
        <article>
          <span className="overline">DATA SOURCES</span>
          <h3>Designed for trusted sources</h3>
          <p>
            Land parcel records load from the connected MongoDB database. Research and policy
            references are currently maintained as catalogue entries in the project.
          </p>
        </article>
      </section>
    </main>
  );
}
