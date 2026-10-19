import Logo from "./Logo";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo light={true} />
          <p>
            BhoomiSetu brings land information, land-use patterns, policies and
            research together in one simple platform.
          </p>
        </div>

        <div className="footer-links">
          <h3>Navigate</h3>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 BhoomiSetu. Academic project — not an official government portal.</p>
      </div>
    </footer>
  );
}

export default Footer;
