import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          MindCare
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/therapists" className="hover:text-primary-100">Find a Therapist</Link>
          <Link to="/resources" className="hover:text-primary-100">Resources</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-primary-100">Dashboard</Link>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-primary-100">Hi, {user?.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-100">Login</Link>
              <Link
                to="/register"
                className="bg-white text-primary-700 px-3 py-1.5 rounded-md font-medium hover:bg-primary-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
