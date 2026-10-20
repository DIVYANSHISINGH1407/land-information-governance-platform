import { useState } from "react";
import "../signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("Your form is valid! Backend registration is not connected yet.");

    console.log("Signup details:", {
      fullName: formData.fullName,
      email: formData.email,
    });
  }

  return (
    <div className="signup-page">
      {/* Navigation Bar */}
      <nav className="signup-navbar">
        <a href="/" className="signup-brand">
          <span className="brand-icon">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="17"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <ellipse
                cx="20"
                cy="20"
                rx="8"
                ry="17"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <ellipse
                cx="20"
                cy="20"
                rx="17"
                ry="7"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <path
                d="M3 20H37M20 3V37"
                stroke="currentColor"
                strokeWidth="1"
              />

              <circle cx="20" cy="20" r="3" fill="currentColor" />
            </svg>
          </span>

          <span className="brand-name">
            Bhoomi<span>Setu</span>
          </span>
        </a>

        <a href="/" className="back-home">
          ← Back to Home
        </a>
      </nav>

      {/* Main Signup Section */}
      <main className="signup-main">
        <section className="signup-card">
          <div className="signup-heading">
            <span className="signup-eyebrow">JOIN BHOOMISETU</span>

            <h1>Create Your Account</h1>

            <p>
              Your gateway to better land information,
              research, and governance insights.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <span className="input-hint">
                Use at least 8 characters.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {error && (
              <p className="signup-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="signup-success" role="status">
                {success}
              </p>
            )}

            <button type="submit" className="create-account-btn">
              Create Account
              <span aria-hidden="true">→</span>
            </button>
          </form>

          {/* Sign In Section */}
          <div className="signup-divider">
            <span></span>
            <p>ALREADY A MEMBER?</p>
            <span></span>
          </div>

          <p className="signin-text">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>

          <p className="signup-disclaimer">
            By creating an account, you agree to use the platform
            responsibly for educational and research purposes.
          </p>
        </section>

        <div className="signup-bottom-text">
          <span className="bottom-dot"></span>
          Bringing land information together, one step at a time.
        </div>
      </main>

      {/* Footer */}
      <footer className="signup-footer">
        © 2026 BhoomiSetu. Academic project — not an official
        government portal.
      </footer>
    </div>
  );
}

export default Signup;