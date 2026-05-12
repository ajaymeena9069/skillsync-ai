import { AUTH_STORAGE_KEY } from "../features/auth/authConstants";

export function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem(AUTH_STORAGE_KEY);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
