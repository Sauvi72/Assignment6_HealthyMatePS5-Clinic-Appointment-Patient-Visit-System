const express = require("express")
const router = express.Router()
const Doctor = require("../models/Doctor")
const Appointment = require("../models/Appointment")
const { auth, authorizeRoles } = require("../middleware/auth")

let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

router.get("/specializations", async function (req, res) {
  let list = await Doctor.distinct("specialization")
  res.json(list)
})

router.get("/", async function (req, res) {
  let filter = {}
  if (req.query.specialization && req.query.specialization != "all") {
    filter.specialization = req.query.specialization
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" }
  }
  let docs = await Doctor.find(filter)
  res.json(docs)
})

router.get("/:id", async function (req, res) {
  let doc = await Doctor.findById(req.params.id)
  res.json(doc)
})

router.get("/:id/slots", async function (req, res) {
  try {
    let doc = await Doctor.findById(req.params.id)
    let date = req.query.date

    let d = new Date(date)
    let dayName = dayNames[d.getDay()]

    if (!doc.availableDays.includes(dayName)) {
      return res.status(400).json({ message: "Doctor not available on " + dayName, slots: [] })
    }

    let booked = await Appointment.find({ doctor: doc._id, date: date, status: { $ne: "Cancelled" } })
    let bookedSlotNames = []
    for (let i = 0; i < booked.length; i++) {
      bookedSlotNames.push(booked[i].slot)
    }

    let startParts = doc.startTime.split(":")
    let endParts = doc.endTime.split(":")
    let startMins = Number(startParts[0]) * 60 + Number(startParts[1])
    let endMins = Number(endParts[0]) * 60 + Number(endParts[1])

    let slots = []
    let t = startMins
    while (t + doc.slotLength <= endMins) {
      let h1 = Math.floor(t / 60)
      let m1 = t % 60
      let h2 = Math.floor((t + doc.slotLength) / 60)
      let m2 = (t + doc.slotLength) % 60

      let from = (h1 < 10 ? "0" + h1 : "" + h1) + ":" + (m1 < 10 ? "0" + m1 : "" + m1)
      let to = (h2 < 10 ? "0" + h2 : "" + h2) + ":" + (m2 < 10 ? "0" + m2 : "" + m2)
      let name = from + " - " + to

      let taken = bookedSlotNames.includes(name)
      slots.push({ slot: name, isBooked: taken, disabled: taken })

      t = t + doc.slotLength
    }

    res.json({ dayName: dayName, date: date, slots: slots })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/", auth, authorizeRoles("admin", "receptionist"), async function (req, res) {
  let doc = await Doctor.create(req.body)
  res.status(201).json(doc)
})

router.put("/:id", auth, authorizeRoles("admin", "receptionist"), async function (req, res) {
  let doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(doc)
})

router.delete("/:id", auth, authorizeRoles("admin", "receptionist"), async function (req, res) {
  await Doctor.findByIdAndDelete(req.params.id)
  await Appointment.deleteMany({ doctor: req.params.id })
  res.json({ message: "Doctor deleted" })
})

module.exports = router
