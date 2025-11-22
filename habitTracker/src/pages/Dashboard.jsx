import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import AddHabitForm from "../components/AddHabitForm";
import HabitCard from "../components/HabitCard";
import Heatmap from "../components/Heatmap";
import "../styles/DashboardLayout.css";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "habits_v1";

// ISO YYYY-MM-DD
const iso = (d) => d.toISOString().slice(0, 10);
const todayKey = () => iso(new Date());

/* -------------------------------------------------------
   AGGREGATE HEATMAP (Moved outside to avoid render error)
--------------------------------------------------------*/
function AggregateHeatmap({ habits = [], days = 30 }) {
  const agg = {};
  const today = new Date();

  // initialize days to false
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    agg[iso(d)] = false;
  }

  // mark true if ANY habit done
  habits.forEach((h) => {
    Object.entries(h.history || {}).forEach(([date, value]) => {
      if (date in agg) agg[date] = agg[date] || value;
    });
  });

  return <Heatmap history={agg} days={days} squareSize={16} />;
}

/* -------------------------------------------------------
   MAIN DASHBOARD COMPONENT
--------------------------------------------------------*/
export default function Dashboard() {
  const { token } = useAuth();

  const [habits, setHabits] = useState([]);

  const [sortBy, setSortBy] = useState("name");
  const [viewDays, setViewDays] = useState(30);

  /* ----------------------------------------------
     Sync habits from API
  ---------------------------------------------- */
  useEffect(() => {
    void (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setHabits(data);
      console.log(data);
    })();
  }, [token]);

  /* ----------------------------------------------
     CRUD operations
  ---------------------------------------------- */

  const addHabit = async (name) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/habits`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      }
    );
    const data = await res.json();
    const newHabit = {
      _id: data._id,
      name,
      history: {},
      createdAt: new Date(data.createdAt).toISOString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const deleteHabit = async (id) => {
    if (!confirm("Delete this habit permanently?")) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/habits/${id}`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (res.ok)
      setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  const toggleToday = async (id) => {
    const today = todayKey();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/habits/${id}`,
      {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'toggle_day', date: today })
      }
    );
    if (res.ok) {
      setHabits((prev) =>
        prev.map((h) => {
          if (h._id !== id) return h;
  
          const copy = { ...h, history: { ...h.history } };
  
          if (copy.history[today]) delete copy.history[today];
          else copy.history[today] = true;
  
          return copy;
        })
      );
    }
  };

  /* ----------------------------------------------
     Sorting Logic
  ---------------------------------------------- */
  const analyzeForSort = (habit) => {
    const today = new Date();
    const history = habit.history || {};

    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(iso(d));
    }
    dates.reverse();

    // longest streak
    let longest = 0;
    let run = 0;
    for (const d of dates) {
      if (history[d]) {
        run++;
        longest = Math.max(longest, run);
      } else run = 0;
    }

    // current streak
    let current = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (history[dates[i]]) current++;
      else break;
    }

    return { current, longest };
  };

  const sortedHabits = useMemo(() => {
    const arr = [...habits];

    arr.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);

      const A = analyzeForSort(a);
      const B = analyzeForSort(b);

      if (sortBy === "longest") return B.longest - A.longest;
      if (sortBy === "current") return B.current - A.current;

      return 0;
    });

    return arr;
  }, [habits, sortBy]);

  /* ----------------------------------------------
     RENDER UI
  ---------------------------------------------- */

  return (
    <>
      <Navbar />

      <main className="container">
        {/* LEFT COLUMN */}
        <section className="left-col">
          <div className="card">
            <div className="card-header">
              <h2>Daily Habits</h2>

              <div className="small-controls">
                <label>Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="longest">Longest streak</option>
                  <option value="current">Current streak</option>
                </select>
              </div>
            </div>

            <div className="add-section">
              <AddHabitForm onAdd={addHabit} />
            </div>

            <div className="list">
              {sortedHabits.length === 0 ? (
                <div className="empty">
                  No habits added yet — create one above.
                </div>
              ) : (
                sortedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleToday={toggleToday}
                    onDelete={deleteHabit}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="right-col">
          <div className="card">
            <div className="card-header">
              <h3>
                Heatmap ({viewDays === 7 ? "7 days" : "30 days"})
              </h3>

              <div className="view-controls">
                <button
                  className={`small ${viewDays === 7 ? "active" : ""}`}
                  onClick={() => setViewDays(7)}
                >
                  7
                </button>
                <button
                  className={`small ${viewDays === 30 ? "active" : ""}`}
                  onClick={() => setViewDays(30)}
                >
                  30
                </button>
              </div>
            </div>

            {/* FIXED: Now declared OUTSIDE Dashboard */}
            <AggregateHeatmap habits={habits} days={viewDays} />
          </div>
        </aside>
      </main>
    </>
  );
}
