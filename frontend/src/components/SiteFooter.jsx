import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo light />
          <p>Bringing land information together for clearer, more informed decisions.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/explore">Explore</Link>
          <Link to="/research">Research</Link>
          <Link to="/policies">Policies</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© 2026 BhumiSetu</span>
      </div>
    </footer>
  );
}
