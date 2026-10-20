const mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "patient" },
  age: Number,
  gender: String,
  phone: String
})

module.exports = mongoose.model("User", userSchema)
