import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to HabitTracker</h1>
      <p>Track your habits with streaks and heatmaps.</p>

      <Link to="/login" className="home-login-btn">
        Login to Continue
      </Link>
    </div>
  );
}
