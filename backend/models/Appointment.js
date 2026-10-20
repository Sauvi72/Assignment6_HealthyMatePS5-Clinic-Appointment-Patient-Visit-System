const mongoose = require("mongoose")

let appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  slot: String,
  status: { type: String, default: "Booked" },
  visitNotes: {
    diagnosis: { type: String, default: "" },
    prescription: { type: String, default: "" }
  },
  rescheduleHistory: [{
    previousDate: String,
    previousSlot: String,
    rescheduledAt: Date
  }]
})

module.exports = mongoose.model("Appointment", appointmentSchema)
