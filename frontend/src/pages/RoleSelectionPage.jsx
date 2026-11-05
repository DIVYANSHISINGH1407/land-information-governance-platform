
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const roles = [
  {
    id: "government",
    icon: "▤",
    name: "Government official",
    description: "Manage land records, reports and public information.",
    access: "Government access",
  },
  {
    id: "public",
    icon: "♙",
    name: "Public user",
    description: "Find land information, maps and government policies.",
    access: "Public access",
  },
];

export default function RoleSelectionPage({ mode = "login" }) {
  const [selectedRole, setSelectedRole] = useState("public");
  const navigate = useNavigate();

  function continueToAccountForm() {
    const nextPage = mode === "signup" ? "signup" : "login";
    navigate(`/${nextPage}/${selectedRole}`);
  }

  return (
    <main className="role-selection-page">
      <section className="role-selection-card">
        <span className="overline">
          {mode === "signup" ? "JOIN BHUMISETU" : "ACCOUNT ACCESS"}
        </span>

        <h1>
          {mode === "signup"
            ? "Choose your account type"
            : "Choose your account"}
        </h1>

        <p className="role-selection-intro">
          {mode === "signup"
            ? "Choose how you will use BhumiSetu to create the right account."
            : "Select the account type you use to sign in to BhumiSetu."}
        </p>

        <div className="role-card-grid">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={
                selectedRole === role.id
                  ? "role-card selected"
                  : "role-card"
              }
              onClick={() => setSelectedRole(role.id)}
              aria-pressed={selectedRole === role.id}
            >
              <span className="role-card-top">
                <span className="role-card-icon">{role.icon}</span>
                {mode === "signup" && (
                  <span className="role-card-access">{role.access}</span>
                )}
              </span>

              <b>
                {mode === "login" && role.id === "public"
                  ? "Public"
                  : role.name}
              </b>

              <span className="role-card-description">
                {role.description}
              </span>

              <small>
                {selectedRole === role.id
                  ? "Selected"
                  : "Click to select"}
              </small>
            </button>
          ))}
        </div>

        <button
          className="primary-button role-continue"
          onClick={continueToAccountForm}
        >
          {mode === "signup"
            ? "Continue to sign up"
            : "Continue to log in"}{" "}
          <span>→</span>
        </button>

        <p className="role-selection-signup">
          {mode === "signup"
            ? "Already have an account?"
            : "New to BhumiSetu?"}{" "}
          <Link to={mode === "signup" ? "/login" : "/signup"}>
            {mode === "signup" ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
