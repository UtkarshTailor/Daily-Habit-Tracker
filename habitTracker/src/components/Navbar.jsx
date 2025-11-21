import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            HabitTracker
          </Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <button className="cta logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="cta login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
