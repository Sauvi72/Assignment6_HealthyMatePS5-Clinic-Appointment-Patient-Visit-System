const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")
const { auth, authorizeRoles } = require("../middleware/auth")

router.use(auth, authorizeRoles("admin", "receptionist"))

router.get("/appointments", async function (req, res) {
  let query = {}
  if (req.query.status && req.query.status != "all") query.status = req.query.status
  if (req.query.doctorId && req.query.doctorId != "all") query.doctor = req.query.doctorId
  if (req.query.date) query.date = req.query.date

  let result = await Appointment.find(query).populate("doctor").populate("patient").sort({ _id: -1 })
  res.json(result)
})

router.get("/dashboard", async function (req, res) {
  let now = new Date()
  let today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0")

  let all = await Appointment.find().populate("doctor")

  let todayCount = 0
  let cancelCount = 0
  let doneCount = 0
  let totalRevenue = 0
  let docData = {}

  for (let i = 0; i < all.length; i++) {
    let a = all[i]
    if (a.date == today) todayCount++
    if (a.status == "Cancelled") cancelCount++
    if (a.status == "Completed") {
      doneCount++
      totalRevenue += a.doctor ? a.doctor.consultationFee : 0
    }

    let dname = a.doctor ? a.doctor.name : "Unknown"
    if (!docData[dname]) {
      docData[dname] = {
        name: dname,
        specialization: a.doctor ? a.doctor.specialization : "",
        total: 0, completed: 0, cancelled: 0, revenue: 0
      }
    }
    docData[dname].total++
    if (a.status == "Completed") {
      docData[dname].completed++
      docData[dname].revenue += a.doctor ? a.doctor.consultationFee : 0
    }
    if (a.status == "Cancelled") {
      docData[dname].cancelled++
    }
  }

  let docList = Object.values(docData)

  res.json({
    todayDate: today,
    todayAppointments: todayCount,
    totalAppointments: all.length,
    cancellations: cancelCount,
    completed: doneCount,
    revenue: totalRevenue,
    doctorStats: docList
  })
})

module.exports = router
