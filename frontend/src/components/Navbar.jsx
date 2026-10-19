import { useState } from "react";
import Logo from "./Logo";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={menuOpen ? "container mobile-menu open" : "container mobile-menu"}>
        <a href="#home" onClick={closeMenu}>
          Home
        </a>
        <a href="#features" onClick={closeMenu}>
          Features
        </a>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
      </div>
    </header>
  );
}

export default Navbar;
