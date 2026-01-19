const express = require("express");
const Condition = require("../models/Condition.js");

const router = express.Router();

/* ---------- GET ALL EXAMS ---------- */
router.get("/", async (req, res) => {
  try {
    const data = await Condition.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- CREATE EXAM ---------- */
router.post("/", async (req, res) => {
  try {
    const exam = new Condition(req.body);
    const saved = await exam.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- UPDATE EXAM ---------- */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Condition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- DELETE EXAM ---------- */
router.delete("/:id", async (req, res) => {
  try {
    await Condition.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
