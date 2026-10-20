import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function MyAppointments() {
  let [appointments, setAppointments] = useState([])
  let { API, token } = useAuth()

  useEffect(function () {
    fetch(API + "/appointments/my", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (r) { return r.json() })
      .then(function (data) { setAppointments(data) })
  }, [])

  function cancelApt(aptId) {
    if (!window.confirm("Cancel this appointment?")) return
    fetch(API + "/appointments/" + aptId + "/cancel", {
      method: "PUT",
      headers: { Authorization: "Bearer " + token }
    })
      .then(function () {
        let updated = appointments.map(function (a) {
          if (a._id === aptId) a.status = "Cancelled"
          return a
        })
        setAppointments(updated)
      })
  }

  return (
    <div className="page">
      <h2>My Appointments</h2>
      {appointments.length === 0 && <p>No appointments yet</p>}
      <div className="card-grid">
        {appointments.map(function (apt) {
          return (
            <div key={apt._id} className={"card " + apt.status.toLowerCase()}>
              <h3>{apt.doctor ? apt.doctor.name : "Doctor"}</h3>
              <p>{apt.doctor ? apt.doctor.specialization : ""}</p>
              <p>Date: {apt.date}</p>
              <p>Slot: {apt.slot}</p>
              <p>Status: <strong>{apt.status}</strong></p>
              <div className="card-actions">
                <Link to={"/appointments/" + apt._id} className="btn">Details</Link>
                {apt.status === "Booked" && (
                  <button className="btn cancel-btn" onClick={function () { cancelApt(apt._id) }}>Cancel</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyAppointments
