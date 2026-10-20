import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Doctors() {
  let [doctors, setDoctors] = useState([])
  let [specs, setSpecs] = useState([])
  let [filter, setFilter] = useState("all")
  let [search, setSearch] = useState("")
  let { API } = useAuth()

  useEffect(function () {
    fetch(API + "/doctors/specializations")
      .then(function (r) { return r.json() })
      .then(function (data) { setSpecs(data) })
  }, [])

  useEffect(function () {
    let url = API + "/doctors?specialization=" + filter + "&search=" + search
    fetch(url)
      .then(function (r) { return r.json() })
      .then(function (data) { setDoctors(data) })
  }, [filter, search])

  return (
    <div className="page">
      <h2>Our Doctors</h2>
      <div className="filters">
        <input type="text" placeholder="Search by name..." value={search} onChange={function (e) { setSearch(e.target.value) }} />
        <select value={filter} onChange={function (e) { setFilter(e.target.value) }}>
          <option value="all">All Specializations</option>
          {specs.map(function (s) {
            return <option key={s} value={s}>{s}</option>
          })}
        </select>
      </div>
      <div className="card-grid">
        {doctors.map(function (doc) {
          return (
            <div key={doc._id} className="card">
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>
              <p>Fee: ₹{doc.consultationFee}</p>
              <p>Days: {doc.availableDays.join(", ")}</p>
              <Link to={"/doctors/" + doc._id} className="btn">Book Appointment</Link>
            </div>
          )
        })}
      </div>
      {doctors.length === 0 && <p>No doctors found</p>}
    </div>
  )
}

export default Doctors
