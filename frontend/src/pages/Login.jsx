import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [error, setError] = useState("")
  let { login, API } = useAuth()
  let navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError("")

    fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.token) {
          login(data.token, data.user)
          if (data.user.role === "admin" || data.user.role === "receptionist") {
            navigate("/admin/dashboard")
          } else {
            navigate("/doctors")
          }
        } else {
          setError(data.message || "Login failed")
        }
      })
      .catch(function () {
        setError("Something went wrong")
      })
  }

  return (
    <div className="form-page">
      <h2>Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={function (e) { setEmail(e.target.value) }} required />
        <input type="password" placeholder="Password" value={password} onChange={function (e) { setPassword(e.target.value) }} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
