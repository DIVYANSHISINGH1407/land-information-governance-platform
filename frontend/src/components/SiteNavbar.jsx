import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const links = [
  ["/", "Home"],
  ["/explore", "Explore"],
  ["/research", "Research"],
  ["/policies", "Policies"],
  ["/about", "About"],
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Logo />
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? "×" : "☰"}
      </button>
      <nav className={open ? "site-nav open" : "site-nav"} aria-label="Main navigation">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="site-actions">
        <Link className="login-link" to="/login">
          Log in
        </Link>
        <Link className="start-button" to="/signup">
          Get Started <span>→</span>
        </Link>
      </div>
    </header>
  );
}
