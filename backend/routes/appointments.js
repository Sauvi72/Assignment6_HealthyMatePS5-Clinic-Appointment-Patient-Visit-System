const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")
const Doctor = require("../models/Doctor")
const { auth, authorizeRoles } = require("../middleware/auth")

let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

router.post("/", auth, async function (req, res) {
  try {
    let doctorId = req.body.doctorId
    let date = req.body.date
    let slot = req.body.slot

    let doc = await Doctor.findById(doctorId)
    if (!doc) return res.status(404).json({ message: "Doctor not found" })

    let d = new Date(date)
    let dayName = dayNames[d.getDay()]
    if (!doc.availableDays.includes(dayName)) {
      return res.status(400).json({ message: "Doctor not available on " + dayName })
    }

    let existing = await Appointment.findOne({ doctor: doctorId, date: date, slot: slot, status: { $ne: "Cancelled" } })
    if (existing) {
      return res.status(400).json({ message: "Slot already booked" })
    }

    let apt = await Appointment.create({
      doctor: doctorId,
      patient: req.user.userId,
      date: date,
      slot: slot
    })
    res.status(201).json(apt)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/my", auth, async function (req, res) {
  let list = await Appointment.find({ patient: req.user.userId }).populate("doctor").sort({ _id: -1 })
  res.json(list)
})

router.get("/:id", auth, async function (req, res) {
  let apt = await Appointment.findById(req.params.id).populate("doctor").populate("patient")
  res.json(apt)
})

router.put("/:id/cancel", auth, async function (req, res) {
  let apt = await Appointment.findById(req.params.id)
  apt.status = "Cancelled"
  await apt.save()
  res.json({ message: "Cancelled", appointment: apt })
})

router.put("/:id/reschedule", auth, async function (req, res) {
  try {
    let apt = await Appointment.findById(req.params.id)
    let newDate = req.body.newDate
    let newSlot = req.body.newSlot

    let clash = await Appointment.findOne({
      _id: { $ne: apt._id },
      doctor: apt.doctor,
      date: newDate,
      slot: newSlot,
      status: { $ne: "Cancelled" }
    })
    if (clash) {
      return res.status(400).json({ message: "That slot is already booked" })
    }

    apt.rescheduleHistory.push({
      previousDate: apt.date,
      previousSlot: apt.slot,
      rescheduledAt: new Date()
    })

    apt.date = newDate
    apt.slot = newSlot
    apt.status = "Booked"
    await apt.save()

    res.json({ message: "Rescheduled", appointment: apt })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put("/:id/status", auth, authorizeRoles("admin", "receptionist"), async function (req, res) {
  let apt = await Appointment.findById(req.params.id)
  apt.status = req.body.status
  await apt.save()
  res.json(apt)
})

router.put("/:id/notes", auth, authorizeRoles("admin", "receptionist"), async function (req, res) {
  let apt = await Appointment.findById(req.params.id)
  apt.visitNotes.diagnosis = req.body.diagnosis || ""
  apt.visitNotes.prescription = req.body.prescription || ""
  apt.status = "Completed"
  await apt.save()
  res.json(apt)
})

module.exports = router
