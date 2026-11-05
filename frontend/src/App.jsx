import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import SiteFooter from "./components/SiteFooter";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ParcelProfilePage from "./pages/ParcelProfilePage";
import ResearchPage from "./pages/ResearchPage";
import PoliciesPage from "./pages/PoliciesPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
  const { loading } = useAuth();

  if (loading) {
      return <div>Loading...</div>;
  }
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
                <ProtectedRoute>
                    <SiteLayout>
                        <ExplorePage />
                    </SiteLayout>
                </ProtectedRoute>
            }
        />
        <Route
          path="/explore/parcels/:parcelId"
          element={
            <SiteLayout>
              <ParcelProfilePage />
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
                <ProtectedRoute>
                    <SiteLayout>
                        <PoliciesPage />
                    </SiteLayout>
                </ProtectedRoute>
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
          path="/register"
          element={
            <SiteLayout>
              <RoleSelectionPage mode="signup" />
            </SiteLayout>
          }
        />
        <Route
          path="/register/:role"
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
