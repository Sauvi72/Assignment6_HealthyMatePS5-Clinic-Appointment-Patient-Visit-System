const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/doctors", require("./routes/doctors"))
app.use("/api/appointments", require("./routes/appointments"))
app.use("/api/admin", require("./routes/admin"))

app.get("/", function (req, res) {
  res.send("Clinic API running")
})

let mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/clinic_appointment_db"

mongoose.connect(mongoUrl).then(function () {
  console.log("MongoDB connected")
  let port = process.env.PORT || 5001
  app.listen(port, function () {
    console.log("Server started on port " + port)
  })
}).catch(function (err) {
  console.log("DB error: " + err.message)
})
