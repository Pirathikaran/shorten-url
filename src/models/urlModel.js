const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  long_url: { type: String, required: true },
  short_url: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date }, // Optional expiration field
});

module.exports = mongoose.model("Url", urlSchema);
