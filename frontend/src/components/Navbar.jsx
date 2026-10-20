import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  let { user, logout } = useAuth()
  let navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">HealthyMate</Link>
      <div className="nav-links">
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && user.role === "patient" && <Link to="/doctors">Doctors</Link>}
        {user && user.role === "patient" && <Link to="/my-appointments">My Appointments</Link>}
        {user && (user.role === "admin" || user.role === "receptionist") && <Link to="/admin/dashboard">Dashboard</Link>}
        {user && (user.role === "admin" || user.role === "receptionist") && <Link to="/admin/doctors/new">Add Doctor</Link>}
        {user && (user.role === "admin" || user.role === "receptionist") && <Link to="/admin/appointments">Appointments</Link>}
        {user && <span className="user-name">Hi, {user.name}</span>}
        {user && <button onClick={handleLogout} className="logout-btn">Logout</button>}
      </div>
    </nav>
  )
}

export default Navbar
