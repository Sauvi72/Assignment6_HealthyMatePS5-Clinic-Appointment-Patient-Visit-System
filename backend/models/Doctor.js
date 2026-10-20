const mongoose = require("mongoose")

let doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  consultationFee: Number,
  availableDays: [String],
  startTime: { type: String, default: "09:00" },
  endTime: { type: String, default: "17:00" },
  slotLength: { type: Number, default: 30 }
})

module.exports = mongoose.model("Doctor", doctorSchema)
