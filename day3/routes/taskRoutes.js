const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      user: req.user.id,
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Task creation failed', error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;
    task.dueDate = req.body.dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Task update failed', error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Task deletion failed', error: err.message });
  }
});

module.exports = router;