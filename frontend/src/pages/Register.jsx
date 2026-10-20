import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Register() {
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [age, setAge] = useState("")
  let [gender, setGender] = useState("")
  let [phone, setPhone] = useState("")
  let [error, setError] = useState("")
  let { login, API } = useAuth()
  let navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError("")

    fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, age: Number(age), gender, phone })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.token) {
          login(data.token, data.user)
          navigate("/doctors")
        } else {
          setError(data.message || "Registration failed")
        }
      })
      .catch(function () {
        setError("Something went wrong")
      })
  }

  return (
    <div className="form-page">
      <h2>Register</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={function (e) { setName(e.target.value) }} required />
        <input type="email" placeholder="Email" value={email} onChange={function (e) { setEmail(e.target.value) }} required />
        <input type="password" placeholder="Password" value={password} onChange={function (e) { setPassword(e.target.value) }} required />
        <input type="number" placeholder="Age" value={age} onChange={function (e) { setAge(e.target.value) }} />
        <select value={gender} onChange={function (e) { setGender(e.target.value) }}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" placeholder="Phone" value={phone} onChange={function (e) { setPhone(e.target.value) }} />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
