import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

let daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function AdminDoctorNew() {
  let { API, token } = useAuth()
  let navigate = useNavigate()

  let [name, setName] = useState("")
  let [specialization, setSpecialization] = useState("")
  let [fee, setFee] = useState("")
  let [startTime, setStartTime] = useState("09:00")
  let [endTime, setEndTime] = useState("17:00")
  let [slotLength, setSlotLength] = useState(30)
  let [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])

  function toggleDay(d) {
    if (selectedDays.includes(d)) {
      setSelectedDays(selectedDays.filter(function (x) { return x !== d }))
    } else {
      setSelectedDays([...selectedDays, d])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (selectedDays.length === 0) {
      alert("Please select at least one day")
      return
    }

    let body = {
      name: name,
      specialization: specialization,
      consultationFee: Number(fee),
      availableDays: selectedDays,
      startTime: startTime,
      endTime: endTime,
      slotLength: Number(slotLength)
    }

    fetch(API + "/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(body)
    })
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data._id) {
          navigate("/doctors")
        } else {
          alert("Could not save doctor")
        }
      })
  }

  return (
    <div className="form-page">
      <h2>Add New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Doctor Name" value={name} onChange={function (e) { setName(e.target.value) }} required />
        <input type="text" placeholder="Specialization" value={specialization} onChange={function (e) { setSpecialization(e.target.value) }} required />
        <input type="number" placeholder="Consultation Fee (₹)" value={fee} onChange={function (e) { setFee(e.target.value) }} required />

        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <label>Start: </label>
            <input type="time" value={startTime} onChange={function (e) { setStartTime(e.target.value) }} required />
          </div>
          <div>
            <label>End: </label>
            <input type="time" value={endTime} onChange={function (e) { setEndTime(e.target.value) }} required />
          </div>
        </div>

        <div>
          <label>Slot Length: </label>
          <input type="number" value={slotLength} onChange={function (e) { setSlotLength(e.target.value) }} required />
        </div>

        <div>
          <p>Available Days:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {daysList.map(function (day) {
              return (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={function () { toggleDay(day) }}
                  />
                  {" " + day}
                </label>
              )
            })}
          </div>
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>Save Doctor</button>
      </form>
    </div>
  )
}

export default AdminDoctorNew
