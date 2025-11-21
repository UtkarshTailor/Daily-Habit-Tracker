import React from "react";
import "../styles/Heatmap.css";

// history: { 'YYYY-MM-DD': true, ... }
// days: number of days to show (e.g., 7, 30)
export default function Heatmap({ history = {}, days = 30, squareSize = 14 }) {
  const today = new Date();
  const daysArr = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (days - 1 - i));
    return d;
  });

  const iso = (d) => d.toISOString().slice(0, 10);

  return (
    <div className="heatmap" style={{ "--size": `${squareSize}px` }}>
      {daysArr.map((d) => {
        const key = iso(d);
        const done = !!history[key];
        return (
          <div
            key={key}
            className={`heat-square ${done ? "done" : "not"}`}
            title={`${key} — ${done ? "Done" : "Not done"}`}
            aria-label={key}
            data-date={key}
          />
        );
      })}
    </div>
  );
}
