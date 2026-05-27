import { Navigate } from "react-router-dom";
import { AUTH_STORAGE_KEY } from "../features/auth/authConstants";
import { getUser } from "../features/auth/authUtils";

export function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  const user = getUser();

  // Check if authenticated
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      user.role === "recruiter" ? "/app/recruiter-dashboard" : "/app/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
