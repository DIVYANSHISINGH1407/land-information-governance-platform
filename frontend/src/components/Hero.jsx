function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-brand">BhoomiSetu</p>
          <p className="hero-label">Land Information &amp; Governance</p>
          <h1 className="hero-title">Connecting Land. Empowering Decisions.</h1>
          <p className="hero-desc">
            Explore land information, understand land-use patterns, and discover
            related policies and research—all through one unified platform.
          </p>
          <div className="hero-actions">
            <a href="#features" className="btn">
              Explore Land
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="map-visual">
            <div className="map-visual-glow"></div>

            {/*
              Simple SVG map using only basic shapes:
              rect = rectangle, circle = circle, ellipse = oval
            */}
            <svg viewBox="0 0 520 460" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Map board */}
              <rect x="24" y="28" width="472" height="404" rx="28" fill="#faf8f3" stroke="#d8e5d8" />

              {/* Soft blocks behind the land */}
              <rect x="90" y="70" width="80" height="250" rx="8" fill="#eef4ee" />
              <rect x="190" y="106" width="70" height="120" rx="8" fill="#eef4ee" />
              <rect x="260" y="98" width="120" height="160" rx="8" fill="#eef4ee" />
              <rect x="240" y="278" width="150" height="70" rx="8" fill="#eef4ee" />

              {/* Land area made from overlapping ovals (easy to explain) */}
              <ellipse cx="270" cy="190" rx="95" ry="110" fill="#1b4332" />
              <ellipse cx="320" cy="210" rx="70" ry="85" fill="#1b4332" />
              <ellipse cx="230" cy="230" rx="65" ry="75" fill="#6b8f71" />
              <ellipse cx="290" cy="150" rx="55" ry="45" fill="#6b8f71" />

              {/* Location markers */}
              <circle cx="248" cy="168" r="16" fill="#f7f3eb" opacity="0.35" />
              <circle cx="248" cy="168" r="7" fill="#f7f3eb" />
              <circle cx="248" cy="168" r="3.2" fill="#1b4332" />

              <circle cx="312" cy="214" r="14" fill="#f7f3eb" opacity="0.3" />
              <circle cx="312" cy="214" r="6.2" fill="#f7f3eb" />
              <circle cx="312" cy="214" r="2.8" fill="#6b8f71" />

              <circle cx="236" cy="268" r="13" fill="#f7f3eb" opacity="0.28" />
              <circle cx="236" cy="268" r="5.6" fill="#f7f3eb" />
              <circle cx="236" cy="268" r="2.5" fill="#1b4332" />

              {/* Small info card on the left */}
              <rect x="48" y="160" width="118" height="54" rx="14" fill="#ffffff" />
              <circle cx="74" cy="187" r="10" fill="#d8e5d8" />
              <rect x="92" y="178" width="56" height="8" rx="4" fill="#1b4332" opacity="0.75" />
              <rect x="92" y="192" width="40" height="6" rx="3" fill="#95b89a" />

              {/* Small chart card on the right */}
              <rect x="360" y="286" width="126" height="58" rx="14" fill="#ffffff" />
              <rect x="378" y="304" width="18" height="22" rx="4" fill="#6b8f71" />
              <rect x="402" y="310" width="18" height="16" rx="4" fill="#95b89a" />
              <rect x="426" y="300" width="18" height="26" rx="4" fill="#1b4332" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
