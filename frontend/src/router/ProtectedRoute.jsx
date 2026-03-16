import { useAuth }    from "@context/AuthContext";
import { PageLoader } from "@components/common";
import LoginPage      from "@pages/auth/LoginPage";

/**
 * Wraps any route that requires authentication.
 * Renders a loader while auth is initialising,
 * redirects to login if no user is found.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user)   return <LoginPage />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", color: "#64748b", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 40 }}>🔒</span>
        <h2 style={{ color: "#f1f5f9", margin: 0 }}>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
