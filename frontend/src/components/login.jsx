import { useState } from "react";
import "./login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");

    // Backend authentication is not connected yet.
    setSuccess(
      "Form validated successfully! Backend authentication is not connected yet."
    );

    console.log("Login details:", {
      email: formData.email,
    });
  }

  return (
    <div className="login-page">
      {/* Navigation */}
      <nav className="login-navbar">
        <a href="/" className="login-brand">
          <span className="login-brand-icon">
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

          <span className="login-brand-name">
            Bhoomi<span>Setu</span>
          </span>
        </a>

        <a href="/" className="login-back-home">
          <span aria-hidden="true">←</span> Back to Home
        </a>
      </nav>

      {/* Login Section */}
      <main className="login-main">
        <section className="login-card">
          <div className="login-heading">
            <span className="login-eyebrow">WELCOME BACK</span>

            <h1>Sign in to BhoomiSetu</h1>

            <p>
              Access your land information
              <br />
              and research dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="login-email">Email Address</label>

              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="login-password">Password</label>

              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="login-success" role="status">
                {success}
              </p>
            )}

            <button type="submit" className="login-submit-btn">
              Sign In <span aria-hidden="true">→</span>
            </button>
          </form>

          {/* Sign-up Link */}
          <div className="login-divider">
            <span></span>
            <p>DON'T HAVE AN ACCOUNT?</p>
            <span></span>
          </div>

          <p className="login-signup-text">
            New to BhoomiSetu?{" "}
            <a href="/signup">Create an account</a>
          </p>

          <p className="login-disclaimer">
            By signing in, you agree to use the platform responsibly
            for educational and research purposes.
          </p>
        </section>

        <div className="login-bottom-text">
          <span className="login-bottom-dot"></span>
          Bringing land information together, one step at a time.
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        © 2026 BhoomiSetu. Academic project — not an official
        government portal.
      </footer>
    </div>
  );
}

export default Login;