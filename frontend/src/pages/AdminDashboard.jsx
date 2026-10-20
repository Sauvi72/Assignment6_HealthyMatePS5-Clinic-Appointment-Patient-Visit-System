import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

function AdminDashboard() {
  let { API, token } = useAuth()
  let [stats, setStats] = useState(null)

  useEffect(function () {
    fetch(API + "/admin/dashboard", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (r) { return r.json() })
      .then(function (data) { setStats(data) })
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <h4>Today's Appointments</h4>
          <p className="big-num">{stats.todayAppointments}</p>
          <p>{stats.todayDate}</p>
        </div>
        <div className="card">
          <h4>Total Appointments</h4>
          <p className="big-num">{stats.totalAppointments}</p>
        </div>
        <div className="card">
          <h4>Completed</h4>
          <p className="big-num">{stats.completed}</p>
        </div>
        <div className="card">
          <h4>Cancellations</h4>
          <p className="big-num">{stats.cancellations}</p>
        </div>
        <div className="card">
          <h4>Total Revenue</h4>
          <p className="big-num">₹{stats.revenue}</p>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Doctor Wise Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Total</th>
            <th>Completed</th>
            <th>Cancelled</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {stats.doctorStats.map(function (d) {
            return (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.total}</td>
                <td>{d.completed}</td>
                <td>{d.cancelled}</td>
                <td>₹{d.revenue}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard
