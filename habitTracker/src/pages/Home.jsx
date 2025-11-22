import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">Build Better Habits</h1>
        <p className="home-subtext">
          Track your habits, visualize progress, and stay consistent with streaks and heatmaps.
        </p>

        <div className="home-btn-group">
          <Link to="/login" className="home-btn">
            Login
          </Link>

          <Link to="/register" className="home-btn secondary-btn">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
