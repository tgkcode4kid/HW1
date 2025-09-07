const Task = require('../models/Task');

exports.getAllTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '100'));
    const skip = (page - 1) * limit;
    const tasks = await Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid ID' });
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = new Task({ title, description, completed });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updates = (({ title, description, completed }) => ({ title, description, completed }))(req.body);
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid ID' });
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid ID' });
    next(err);
  }
};
