import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AppointmentDetail() {
  let { id } = useParams()
  let { API, token, user } = useAuth()
  let navigate = useNavigate()

  let [apt, setApt] = useState(null)
  let [newDate, setNewDate] = useState("")
  let [newSlot, setNewSlot] = useState("")
  let [slots, setSlots] = useState([])
  let [showResched, setShowResched] = useState(false)
  let [msg, setMsg] = useState("")
  let [diagnosis, setDiagnosis] = useState("")
  let [prescription, setPrescription] = useState("")
  let [statusVal, setStatusVal] = useState("")

  useEffect(function () {
    fetch(API + "/appointments/" + id, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        setApt(data)
        if (data.visitNotes) {
          setDiagnosis(data.visitNotes.diagnosis || "")
          setPrescription(data.visitNotes.prescription || "")
        }
        setStatusVal(data.status)
      })
  }, [id])

  function fetchSlots(d) {
    setNewDate(d)
    setNewSlot("")
    if (!apt || !apt.doctor) return
    fetch(API + "/doctors/" + apt.doctor._id + "/slots?date=" + d)
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.slots) setSlots(data.slots)
        else setSlots([])
      })
  }

  function reschedule() {
    if (!newSlot) return
    fetch(API + "/appointments/" + id + "/reschedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ newDate: newDate, newSlot: newSlot })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.appointment) {
          setMsg("Rescheduled!")
          setShowResched(false)
          setApt(data.appointment)
        } else {
          setMsg(data.message || "Failed")
        }
      })
  }

  function saveNotes() {
    fetch(API + "/appointments/" + id + "/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ diagnosis, prescription })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        setApt(data)
        setMsg("Notes saved")
      })
  }

  function changeStatus(s) {
    fetch(API + "/appointments/" + id + "/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ status: s })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        setApt(data)
        setStatusVal(data.status)
      })
  }

  if (!apt) return <p>Loading...</p>

  let isAdmin = user && (user.role === "admin" || user.role === "receptionist")

  return (
    <div className="page">
      <h2>Appointment Details</h2>
      {msg && <p className="success-msg">{msg}</p>}
      <div className="detail-card">
        <p><strong>Doctor:</strong> {apt.doctor ? apt.doctor.name : "N/A"}</p>
        <p><strong>Specialization:</strong> {apt.doctor ? apt.doctor.specialization : ""}</p>
        <p><strong>Date:</strong> {apt.date}</p>
        <p><strong>Slot:</strong> {apt.slot}</p>
        <p><strong>Status:</strong> {apt.status}</p>
        {apt.patient && <p><strong>Patient:</strong> {apt.patient.name} ({apt.patient.email})</p>}
        {apt.visitNotes && apt.visitNotes.diagnosis && <p><strong>Diagnosis:</strong> {apt.visitNotes.diagnosis}</p>}
        {apt.visitNotes && apt.visitNotes.prescription && <p><strong>Prescription:</strong> {apt.visitNotes.prescription}</p>}

        {apt.rescheduleHistory && apt.rescheduleHistory.length > 0 && (
          <div>
            <h4>Reschedule History</h4>
            {apt.rescheduleHistory.map(function (h, i) {
              return <p key={i}>{h.previousDate} {h.previousSlot} → rescheduled on {new Date(h.rescheduledAt).toLocaleDateString()}</p>
            })}
          </div>
        )}
      </div>

      {apt.status === "Booked" && !isAdmin && (
        <div>
          <button className="btn" onClick={function () { setShowResched(!showResched) }}>Reschedule</button>
          {showResched && (
            <div className="resched-section">
              <input type="date" value={newDate} onChange={function (e) { fetchSlots(e.target.value) }} />
              {slots.length > 0 && (
                <div className="slots-grid">
                  {slots.map(function (s) {
                    return (
                      <button
                        key={s.slot}
                        className={"slot-btn" + (s.isBooked ? " booked" : "") + (newSlot === s.slot ? " selected" : "")}
                        disabled={s.isBooked}
                        onClick={function () { setNewSlot(s.slot) }}
                      >
                        {s.slot}
                      </button>
                    )
                  })}
                </div>
              )}
              {newSlot && <button className="btn" onClick={reschedule}>Confirm Reschedule</button>}
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="admin-section">
          <h3>Update Status</h3>
          <select value={statusVal} onChange={function (e) { changeStatus(e.target.value) }}>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <h3>Visit Notes</h3>
          <textarea placeholder="Diagnosis" value={diagnosis} onChange={function (e) { setDiagnosis(e.target.value) }}></textarea>
          <textarea placeholder="Prescription" value={prescription} onChange={function (e) { setPrescription(e.target.value) }}></textarea>
          <button className="btn" onClick={saveNotes}>Save Notes</button>
        </div>
      )}

      <button className="btn" onClick={function () { navigate(-1) }}>Back</button>
    </div>
  )
}

export default AppointmentDetail
