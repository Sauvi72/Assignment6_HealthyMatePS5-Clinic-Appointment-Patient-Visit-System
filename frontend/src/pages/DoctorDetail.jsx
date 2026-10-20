import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function DoctorDetail() {
  let { id } = useParams()
  let { API, token, user } = useAuth()
  let navigate = useNavigate()

  let [doc, setDoc] = useState(null)
  let [date, setDate] = useState("")
  let [slots, setSlots] = useState([])
  let [picked, setPicked] = useState("")
  let [msg, setMsg] = useState("")
  let [dayInfo, setDayInfo] = useState("")

  useEffect(function () {
    fetch(API + "/doctors/" + id)
      .then(function (r) { return r.json() })
      .then(function (data) { setDoc(data) })
  }, [id])

  function loadSlots(d) {
    setDate(d)
    setPicked("")
    setMsg("")
    fetch(API + "/doctors/" + id + "/slots?date=" + d)
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.slots) {
          setSlots(data.slots)
          setDayInfo(data.dayName)
        } else {
          setSlots([])
          setDayInfo(data.message || "")
        }
      })
  }

  function bookSlot() {
    if (!token || !user) {
      setMsg("Please login to book appointment")
      return
    }
    if (!picked) return
    fetch(API + "/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ doctorId: id, date: date, slot: picked })
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data._id) {
          navigate("/my-appointments")
        } else {
          setMsg(data.message || "Booking failed")
        }
      })
  }

  if (!doc) return <p>Loading...</p>

  return (
    <div className="page">
      <h2>{doc.name}</h2>
      <p>{doc.specialization} | Fee: ₹{doc.consultationFee}</p>
      <p>Available: {doc.availableDays.join(", ")}</p>
      <p>Hours: {doc.startTime} - {doc.endTime}</p>

      <div className="booking-section">
        <h3>Select Date</h3>
        <input type="date" value={date} onChange={function (e) { loadSlots(e.target.value) }} />

        {dayInfo && <p>{dayInfo}</p>}
        {msg && (
          <p className="error-msg">
            {msg}
            {(!token || !user) && (
              <span> — <Link to="/login" style={{ textDecoration: "underline", fontWeight: "bold" }}>Login here</Link></span>
            )}
          </p>
        )}

        {slots.length > 0 && (
          <div className="slots-grid">
            {slots.map(function (s) {
              return (
                <button
                  key={s.slot}
                  className={"slot-btn" + (s.isBooked ? " booked" : "") + (picked === s.slot ? " selected" : "")}
                  disabled={s.isBooked}
                  onClick={function () { setPicked(s.slot) }}
                >
                  {s.slot}
                </button>
              )
            })}
          </div>
        )}

        {picked && (
          <div>
            {!user ? (
              <p style={{ marginTop: "10px" }}>
                <Link to="/login" className="btn">Login to book appointment</Link>
              </p>
            ) : (
              <button className="btn" onClick={bookSlot}>Book {picked}</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDetail
