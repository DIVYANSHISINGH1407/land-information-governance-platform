function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <p className="hero-brand">BhoomiSetu</p>

        <h1 className="hero-title">Land Information &amp; Governance Platform</h1>

        <h2 className="hero-subtitle">Find. Understand. Analyse.</h2>

        <p className="hero-desc">All land-related information in one place.</p>

        {/* Visual search only for now — no real search logic yet */}
        <div className="hero-search">
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by location, land type, or keyword..."
          />
          <button type="button" className="hero-search-btn">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
