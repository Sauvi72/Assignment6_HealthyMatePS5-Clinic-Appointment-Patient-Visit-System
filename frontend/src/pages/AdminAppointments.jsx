import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

function AdminAppointments() {
  let { API, token } = useAuth()

  let [appointments, setAppointments] = useState([])
  let [doctors, setDoctors] = useState([])
  let [status, setStatus] = useState("all")
  let [doctorId, setDoctorId] = useState("all")
  let [date, setDate] = useState("")

  let [selectedApt, setSelectedApt] = useState(null)
  let [diagnosis, setDiagnosis] = useState("")
  let [prescription, setPrescription] = useState("")

  useEffect(function () {
    fetch(API + "/doctors")
      .then(function (r) { return r.json() })
      .then(function (data) { setDoctors(data) })
  }, [])

  function loadAppointments() {
    let url = API + "/admin/appointments?status=" + status + "&doctorId=" + doctorId + "&date=" + date
    fetch(url, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (r) { return r.json() })
      .then(function (data) { setAppointments(data) })
  }

  useEffect(function () {
    loadAppointments()
  }, [status, doctorId, date])

  function updateStatus(id, s) {
    fetch(API + "/appointments/" + id + "/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ status: s })
    })
      .then(function () { loadAppointments() })
  }

  function openNotes(a) {
    setSelectedApt(a)
    setDiagnosis(a.visitNotes ? a.visitNotes.diagnosis : "")
    setPrescription(a.visitNotes ? a.visitNotes.prescription : "")
  }

  function saveNotes(e) {
    e.preventDefault()
    fetch(API + "/appointments/" + selectedApt._id + "/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ diagnosis: diagnosis, prescription: prescription })
    })
      .then(function () {
        setSelectedApt(null)
        loadAppointments()
      })
  }

  return (
    <div className="page">
      <h2>All Appointments</h2>

      <div className="filters">
        <select value={status} onChange={function (e) { setStatus(e.target.value) }}>
          <option value="all">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Checked-In">Checked-In</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select value={doctorId} onChange={function (e) { setDoctorId(e.target.value) }}>
          <option value="all">All Doctors</option>
          {doctors.map(function (d) {
            return <option key={d._id} value={d._id}>{d.name}</option>
          })}
        </select>

        <input type="date" value={date} onChange={function (e) { setDate(e.target.value) }} />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Slot</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(function (apt) {
            return (
              <tr key={apt._id}>
                <td>{apt.patient ? apt.patient.name : "N/A"}<br/><small>{apt.patient ? apt.patient.phone : ""}</small></td>
                <td>{apt.doctor ? apt.doctor.name : "N/A"}</td>
                <td>{apt.date}<br/>{apt.slot}</td>
                <td>{apt.status}</td>
                <td>
                  {apt.status === "Booked" && (
                    <button className="btn" onClick={function () { updateStatus(apt._id, "Checked-In") }}>Check-In</button>
                  )}
                  {apt.status === "Checked-In" && (
                    <button className="btn" onClick={function () { updateStatus(apt._id, "Completed") }}>Complete</button>
                  )}
                  {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                    <button className="btn cancel-btn" onClick={function () { updateStatus(apt._id, "Cancelled") }}>Cancel</button>
                  )}
                </td>
                <td>
                  <button className="btn" onClick={function () { openNotes(apt) }}>
                    {apt.visitNotes && apt.visitNotes.diagnosis ? "Edit Notes" : "Add Notes"}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {selectedApt && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}>
          <h3>Visit Notes for {selectedApt.patient ? selectedApt.patient.name : ""}</h3>
          <form onSubmit={saveNotes}>
            <input
              type="text"
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={function (e) { setDiagnosis(e.target.value) }}
              required
            />
            <textarea
              placeholder="Prescription"
              value={prescription}
              onChange={function (e) { setPrescription(e.target.value) }}
              required
            ></textarea>
            <button type="submit">Save Notes</button>
            <button type="button" onClick={function () { setSelectedApt(null) }} style={{ marginLeft: "10px" }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminAppointments
