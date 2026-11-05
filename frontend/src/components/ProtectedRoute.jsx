
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is logged in, but doesn't have the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
