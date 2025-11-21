import React, { useMemo } from "react";
import Heatmap from "./Heatmap";
import "../styles/HabitCard.css";

// Helpers
const iso = (d) => d.toISOString().slice(0, 10);

// Calculate streaks & progress
function analyzeHistory(history = {}, windowDays = 30) {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < windowDays; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(iso(d));
  }
  // reverse -> oldest -> newest
  dates.reverse();

  // progress % over windowDays
  const doneCount = dates.reduce((acc, dt) => acc + (history[dt] ? 1 : 0), 0);
  const progress = Math.round((doneCount / windowDays) * 100);

  // current streak (consecutive from today backwards)
  let current = 0;
  for (let i = 0; i < dates.length; i++) {
    const idx = dates.length - 1 - i;
    const dt = dates[idx];
    if (history[dt]) current++;
    else break;
  }

  // longest streak within window
  let longest = 0;
  let running = 0;
  for (let i = 0; i < dates.length; i++) {
    if (history[dates[i]]) {
      running++;
      if (running > longest) longest = running;
    } else running = 0;
  }

  return { progress, current, longest, windowDates: dates };
}

export default function HabitCard({ habit, onToggleToday, onDelete, onToggleDay }) {
  const { id, name, history = {} } = habit;

  const { progress, current, longest, windowDates } = useMemo(
    () => analyzeHistory(history, 30),
    [history]
  );

  const todayKey = iso(new Date());
  const todayDone = !!history[todayKey];

  return (
    <div className="habit-card">
      <div className="habit-main">
        <div className="habit-title">
          <h3>{name}</h3>
          <div className="meta">
            <span className="progress">{progress}%</span>
            <span className="streak">● {current} / {longest}</span>
          </div>
        </div>

        <div className="habit-actions">
          <button
            className={`mark-btn ${todayDone ? "done" : ""}`}
            onClick={() => onToggleToday(id)}
          >
            {todayDone ? "Marked" : "Mark Today"}
          </button>
          <button className="delete-btn" onClick={() => onDelete(id)}>Delete</button>
        </div>
      </div>

      <div className="habit-heatmap">
        <div className="mini-heat">
          {/* small clickable grid for last 7 days */}
          <div className="mini-grid">
            {windowDates.slice(-7).map((d) => (
              <button
                key={d}
                className={`mini-cell ${history[d] ? "done" : "not"}`}
                onClick={() => onToggleDay(id, d)}
                title={d}
                aria-label={`toggle ${d}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
