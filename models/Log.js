const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  id: { type: String, trim: true, required: [true, "ID is required"] },
  text: {
    type: String,
    trim: true,
    required: [true, "Log text is required"],
  },
  priority: {
    type: String,
    trim: true,
    default: "low",
    enum: ["low", "moderate", "high"],
  },
  user: {
    type: String,
    trim: true,
    required: [true, "User is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", LogSchema);
