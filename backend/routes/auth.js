const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

router.post("/register", async function (req, res) {
  try {
    let { name, email, password, role, age, gender, phone } = req.body

    let existing = await User.findOne({ email: email })
    if (existing) {
      return res.status(400).json({ message: "Email already exists" })
    }

    let hashed = await bcrypt.hash(password, 10)
    let user = await User.create({ name, email, password: hashed, role: role || "patient", age, gender, phone })

    let token = jwt.sign({ userId: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/login", async function (req, res) {
  try {
    let { email, password } = req.body
    let user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    let match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: "Wrong password" })
    }

    let token = jwt.sign({ userId: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/me", auth, async function (req, res) {
  let user = await User.findById(req.user.userId).select("-password")
  res.json(user)
})

module.exports = router
