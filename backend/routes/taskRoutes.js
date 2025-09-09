import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Add Task
router.post("/add", async (req, res) => {
  try {
    const { title, description, status } = req.body; // only allowed fields
    if (!title) return res.status(400).json({ error: "Title is required" });

    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res
      .status(err.name === "ValidationError" ? 400 : 500)
      .json({ error: err.message });
  }
});

// Get All Tasks
router.get("/get", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get("/get/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put("/update/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res
      .status(err.name === "ValidationError" ? 400 : 500)
      .json({ error: err.message });
  }
});

// Delete Task
router.delete("/delete/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Task Status only
router.patch("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res
      .status(err.name === "ValidationError" ? 400 : 500)
      .json({ error: err.message });
  }
});

// Get Tasks by Status
router.get("/status/:status", async (req, res) => {
  try {
    const tasks = await Task.find({ status: req.params.status });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
