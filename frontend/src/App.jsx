import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Doctors from "./pages/Doctors"
import DoctorDetail from "./pages/DoctorDetail"
import MyAppointments from "./pages/MyAppointments"
import AppointmentDetail from "./pages/AppointmentDetail"
import AdminDoctorNew from "./pages/AdminDoctorNew"
import AdminDoctorEdit from "./pages/AdminDoctorEdit"
import AdminAppointments from "./pages/AdminAppointments"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Navbar />
          <div className="main">
            <Routes>
              <Route path="/" element={<Navigate to="/doctors" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/appointments/:id" element={<AppointmentDetail />} />
              <Route path="/my-appointments/:id" element={<AppointmentDetail />} />
              <Route path="/admin/doctors/new" element={<AdminDoctorNew />} />
              <Route path="/admin/doctors/:id/edit" element={<AdminDoctorEdit />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
