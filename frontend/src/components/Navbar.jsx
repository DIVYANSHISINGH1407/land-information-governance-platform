import { useState } from "react";
import Logo from "./Logo";

const links = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />

        <div className="nav-right">
          <nav className="nav-links">
            {links.map((link) => (
              <a key={link.name} href={link.href}>
                {link.name}
              </a>
            ))}
          </nav>

          <a href="/signup" className="signup-btn">
            Sign Up
          </a>

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={menuOpen ? "container mobile-menu open" : "container mobile-menu"}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
        <a
          href="/signup"
          className="signup-btn mobile-signup"
          onClick={() => setMenuOpen(false)}
        >
          Sign Up
        </a>
      </div>
    </header>
  );
}

export default Navbar;
