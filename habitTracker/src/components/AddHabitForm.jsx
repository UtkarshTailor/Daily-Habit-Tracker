import React, { useState } from "react";
import "../styles/AddHabitForm.css";

export default function AddHabitForm({ onAdd }) {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit (e.g., Read, Exercise)"
        aria-label="Habit name"
      />
      <div className="controls">
        <button className="add-btn" type="submit">Add</button>
      </div>
    </form>
  );
}
