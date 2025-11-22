import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      return setError("All fields are required.");
    }

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    const { success } = await register(name, email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      return setError("An error occurred while registering");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="register-submit-btn">
            Register
          </button>
        </form>

        <p className="register-info">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="register-links">
          <Link to="/" className="back-home-btn">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
