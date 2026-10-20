const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const User = require("./models/User")
const Doctor = require("./models/Doctor")

let url = process.env.MONGO_URI || "mongodb://localhost:27017/clinic_appointment_db"

let adminEmail = process.env.ADMIN_EMAIL || "admin@clinic.com"
let adminPassword = process.env.ADMIN_PASSWORD || "admin123"
let adminName = process.env.ADMIN_NAME || "sauvi receptionist"
let adminPhone = process.env.ADMIN_PHONE || "9876543210"

async function seedDB() {
  await mongoose.connect(url)

  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    let pass = await bcrypt.hash(adminPassword, 10)
    await User.create({
      name: adminName,
      email: adminEmail,
      password: pass,
      role: "admin",
      phone: adminPhone
    })
    console.log("Admin created")
  } else {
    admin.name = adminName
    await admin.save()
    console.log("Admin name updated to " + adminName)
  }

  let patient = await User.findOne({ email: "patient@clinic.com" })
  if (!patient) {
    let pass = await bcrypt.hash("patient123", 10)
    await User.create({
      name: "Rahul Sharma",
      email: "patient@clinic.com",
      password: pass,
      role: "patient",
      age: 28,
      gender: "Male",
      phone: "9123456780"
    })
    console.log("Patient created")
  }

  let count = await Doctor.countDocuments()
  if (count == 0) {
    await Doctor.insertMany([
      { name: "Dr. Ananya Verma", specialization: "Cardiologist", consultationFee: 800, availableDays: ["Monday", "Wednesday", "Friday"], startTime: "09:00", endTime: "13:00", slotLength: 30 },
      { name: "Dr. Rajesh Iyer", specialization: "General Physician", consultationFee: 500, availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], startTime: "10:00", endTime: "16:00", slotLength: 30 },
      { name: "Dr. Neha Gupta", specialization: "Dermatologist", consultationFee: 700, availableDays: ["Tuesday", "Thursday", "Saturday"], startTime: "11:00", endTime: "15:00", slotLength: 20 }
    ])
    console.log("Doctors added")
  }

  console.log("Done seeding")
  process.exit(0)
}

seedDB()
