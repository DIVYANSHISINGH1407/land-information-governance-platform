import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const roleNames = {
  public: "Public user",
  researcher: "Researcher",
  government: "Government official",
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    governmentId: "",
    researcherId: "",
    university: "",
    document: "",
  });

  function updateField(event) {
    setFields({ ...fields, [event.target.name]: event.target.value });
    setError("");
  }

  function submitForm(event) {
    event.preventDefault();

    if (fields.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (mode === "signup" && fields.password !== fields.confirm) {
      setError("Your passwords do not match.");
      return;
    }

    if (mode === "login") {
      // Read the old key too, so existing demo accounts still work after the name change.
      const savedAccount =
        localStorage.getItem("bhumisetu-demo-user") || localStorage.getItem("bhoomisetu-demo-user");
      const account = JSON.parse(savedAccount || "null");

      if (!account || account.email !== fields.email || account.role !== role) {
        setError("No demo account found for this email. Create an account first.");
        return;
      }

      navigate("/explore");
      return;
    }

    if (role === "public") {
      localStorage.setItem(
        "bhumisetu-demo-user",
        JSON.stringify({ name: fields.name, email: fields.email, role }),
      );
      navigate("/explore");
      return;
    }

    setComplete(true);
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <span className="overline">BHUMISETU · ACCOUNT SETUP</span>
        <h1>
          {complete
            ? "Request received."
            : mode === "signup"
              ? "Create your account."
              : "Welcome back."}
        </h1>
        <p>
          {complete
            ? "This prototype cannot verify credentials or documents. A secure verification service is required to complete this account."
            : mode === "signup"
              ? `Create a ${roleNames[role].toLowerCase()} account to get started.`
              : "Log in to continue to your BhumiSetu workspace."}
        </p>
        <p className="selected-login-role">
          {mode === "login" ? "Signing in as" : "Creating a"} <b>{roleNames[role]}</b>
          {" · "}
          <Link to={mode === "login" ? "/login" : "/signup"}>Change account type</Link>
        </p>
      </section>

      {complete ? (
        <section className="auth-form verification-panel">
          <span className="verification-check">✓</span>
          <h2>Verification required</h2>
          <p>
            Your{" "}
            {role === "government" ? "government ID and documentation" : "university approval form"}{" "}
            were selected for this demo request.
          </p>
          <Link className="primary-button" to="/">
            Return Home <span>→</span>
          </Link>
        </section>
      ) : (
        <form className="auth-form" onSubmit={submitForm}>
          {mode === "signup" && (
            <label>
              Full name
              <input
                name="name"
                value={fields.name}
                onChange={updateField}
                placeholder="Your name"
                required
              />
            </label>
          )}

          {mode === "signup" && role === "government" && (
            <label>
              Government ID
              <input
                name="governmentId"
                value={fields.governmentId}
                onChange={updateField}
                placeholder="Enter official ID"
                required
              />
            </label>
          )}

          {mode === "signup" && role === "researcher" && (
            <label>
              University / institution
              <input
                name="university"
                value={fields.university}
                onChange={updateField}
                placeholder="Institution name"
                required
              />
            </label>
          )}

          {mode === "login" && role === "government" && (
            <label>
              Government ID
              <input
                name="governmentId"
                value={fields.governmentId}
                onChange={updateField}
                placeholder="Enter your government ID"
                required
              />
            </label>
          )}

          {mode === "login" && role === "researcher" && (
            <label>
              Researcher ID
              <input
                name="researcherId"
                value={fields.researcherId}
                onChange={updateField}
                placeholder="Enter your researcher ID"
                required
              />
            </label>
          )}

          <label>
            {mode === "login" && role !== "public" ? "Account email" : "Email address"}
            <input
              type="email"
              name="email"
              value={fields.email}
              onChange={updateField}
              placeholder="you@example.com"
              required
            />
          </label>

          {mode === "signup" && role !== "public" && (
            <label>
              {role === "researcher"
                ? "University approval form"
                : "Supporting government documentation"}
              <span className="auth-file">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={(event) =>
                    setFields({ ...fields, document: event.target.files?.[0]?.name || "" })
                  }
                />
                {fields.document || "Attach PDF, JPG or PNG"}
              </span>
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              name="password"
              value={fields.password}
              onChange={updateField}
              minLength={8}
              placeholder="At least 8 characters"
              required
            />
          </label>

          {mode === "signup" && (
            <label>
              Confirm password
              <input
                type="password"
                name="confirm"
                value={fields.confirm}
                onChange={updateField}
                placeholder="Re-enter password"
                required
              />
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}
          <button className="primary-button auth-submit">
            {mode === "signup" ? "Create account" : "Log in"}
            <span>→</span>
          </button>
          <p className="auth-switch">
            {mode === "signup" ? "Already have an account?" : "New to BhumiSetu?"}{" "}
            <Link to={mode === "signup" ? "/login" : "/signup"}>
              {mode === "signup" ? "Log in" : "Create an account"}
            </Link>
          </p>
        </form>
      )}
    </main>
  );
}
