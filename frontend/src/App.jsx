import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import SiteFooter from "./components/SiteFooter";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ResearchPage from "./pages/ResearchPage";
import PoliciesPage from "./pages/PoliciesPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import "./App.css";

function SiteLayout({ children }) {
  return (
    <>
      <SiteNavbar />
      {children}
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <HomePage />
            </SiteLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <SiteLayout>
              <ExplorePage />
            </SiteLayout>
          }
        />
        <Route
          path="/research"
          element={
            <SiteLayout>
              <ResearchPage />
            </SiteLayout>
          }
        />
        <Route
          path="/policies"
          element={
            <SiteLayout>
              <PoliciesPage />
            </SiteLayout>
          }
        />
        <Route
          path="/about"
          element={
            <SiteLayout>
              <AboutPage />
            </SiteLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <SiteLayout>
              <RoleSelectionPage mode="signup" />
            </SiteLayout>
          }
        />
        <Route
          path="/signup/:role"
          element={
            <SiteLayout>
              <AuthPage mode="signup" />
            </SiteLayout>
          }
        />
        <Route
          path="/login"
          element={
            <SiteLayout>
              <RoleSelectionPage />
            </SiteLayout>
          }
        />
        <Route
          path="/login/:role"
          element={
            <SiteLayout>
              <AuthPage mode="login" />
            </SiteLayout>
          }
        />
        <Route
          path="*"
          element={
            <SiteLayout>
              <main className="not-found">
                <span className="overline">PAGE NOT FOUND</span>
                <h1>That page isn’t here.</h1>
                <a className="primary-button" href="/">
                  Return home →
                </a>
              </main>
            </SiteLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
