
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


const roleNames = {
  public: "Public user",
  government: "Government official",
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { role } = useParams();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    governmentId: "",
  });

  function updateField(event) {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
    setError("");
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");

    if (!["public", "government"].includes(role)) {
      setError("Invalid account type.");
      return;
    }

    if (fields.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (mode === "signup" && fields.password !== fields.confirm) {
      setError("Your passwords do not match.");
      return;
    }

    if (mode === "login" && role === "government" &&
        !fields.governmentId.trim()) {
      setError("Please enter your Government ID.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        const response = await api.post("/auth/register", {
          fullName: fields.name,
          email: fields.email,
          password: fields.password,
          confirmPassword: fields.confirm,
          role,
        });

        setRegisteredUser(response.data.user);
      } else {
        const loginData = {
          email: fields.email,
          password: fields.password,
        };

        if (role === "government") {
          loginData.governmentId = fields.governmentId;
        }

        const response = await api.post("/auth/login", loginData);

        // Store the logged-in user's details in AuthContext
        login(response.data.user);

        navigate("/explore");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Registration success screen
  if (registeredUser) {
    return (
      <main className="auth-page">
        <section className="auth-intro">
          <span className="overline">BHUMISETU · REGISTRATION</span>
          <h1>Account created successfully!</h1>
          <p>Your BhumiSetu account is ready.</p>
        </section>

        <section className="auth-form">
          <h2>Welcome, {registeredUser.fullName}!</h2>

          <p>Email: {registeredUser.email}</p>
          <p>Account type: {roleNames[registeredUser.role]}</p>

          {registeredUser.governmentId && (
            <div>
              <h3>Your Government ID</h3>
              <p>{registeredUser.governmentId}</p>
              <p>Please save this ID. You will need it when logging in.</p>
            </div>
          )}

          <Link
            className="primary-button auth-submit"
            to={`/login/${role}`}
          >
            Continue to Login →
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <span className="overline">BHUMISETU · ACCOUNT SETUP</span>

        <h1>
          {mode === "signup"
            ? "Create your account."
            : "Welcome back."}
        </h1>

        <p>
          {mode === "signup"
            ? `Create a ${roleNames[role]?.toLowerCase()} account to get started.`
            : "Log in to continue to your BhumiSetu workspace."}
        </p>

        <p className="selected-login-role">
          {mode === "login" ? "Signing in as" : "Creating a"}{" "}
          <b>{roleNames[role]}</b>
          {" · "}
          <Link to={mode === "login" ? "/login" : "/signup"}>
            Change account type
          </Link>
        </p>
      </section>

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

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={updateField}
            placeholder="you@example.com"
            required
          />
        </label>

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

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-button auth-submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
              ? "Create account"
              : "Log in"}
          <span>→</span>
        </button>

        <p className="auth-switch">
          {mode === "signup"
            ? "Already have an account?"
            : "New to BhumiSetu?"}{" "}
          <Link to={mode === "signup" ? "/login" : "/signup"}>
            {mode === "signup" ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </main>
  );
}
