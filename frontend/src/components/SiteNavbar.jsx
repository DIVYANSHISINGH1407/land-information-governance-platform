
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const links = [
  ["/", "Home"],
  ["/explore", "Explore"],
  ["/research", "Research"],
  ["/policies", "Policies"],
  ["/about", "About"],
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

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

      <nav
        className={open ? "site-nav open" : "site-nav"}
        aria-label="Main navigation"
      >
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="site-actions">
        {user ? (
          <>
            <span className="login-link">
              {user.fullName}
            </span>

            <button
              className="start-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="login-link" to="/login">
              Log in
            </Link>

            <Link className="start-button" to="/register">
              Get Started <span>→</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
