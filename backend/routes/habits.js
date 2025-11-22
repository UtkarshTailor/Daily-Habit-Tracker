const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// GET /api/habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/habits  { name }
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const habit = new Habit({ user: req.user._id, name });
    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/habits/:id
router.delete('/:id', async (req, res) => {
  try {
    const h = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!h) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/habits/:id
// body: { action: 'toggle_day', date: 'YYYY-MM-DD' } OR { action: 'update', name: 'new name' }
router.patch('/:id', async (req, res) => {
  try {
    const { action } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    if (action === 'toggle_day') {
      const { date } = req.body; // e.g., '2025-11-21'
      if (!date) return res.status(400).json({ message: 'date required' });

      const cur = habit.history.get(date);
      if (cur) habit.history.delete(date);
      else habit.history.set(date, true);

      await habit.save();
      return res.json(habit);
    }

    if (action === 'set_history') {
      // body: { history: { '2025-11-01': true, ... } }
      const { history } = req.body;
      if (!history || typeof history !== 'object') return res.status(400).json({ message: 'history required' });
      habit.history = history;
      await habit.save();
      return res.json(habit);
    }

    if (action === 'update') {
      const { name } = req.body;
      if (name) habit.name = name;
      await habit.save();
      return res.json(habit);
    }

    res.status(400).json({ message: 'Unknown action' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
