const mongoose = require("mongoose");

const ConditionSchema = new mongoose.Schema(
  {
    exam: { type: String, required: true, trim: true },
    cond: { type: Array, required: true }, // flexible structure
    status: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Condition", ConditionSchema);
