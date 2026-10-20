# HealthyMate – Clinic Appointment & Patient Visit System

HealthyMate is my Assignment 6 project for Problem Statement 5 (PS5). It is a MERN stack web application that helps patients book doctor appointments online and allows the clinic receptionist to manage appointments, doctor schedules, and patient visits.

Patients can choose a doctor, check available time slots, book appointments, and view their booking history. The receptionist can manage doctors, track appointments, update visit statuses, and add diagnosis and prescription notes.

## Features

### Patient

- Register and log in to the application.
- View all available doctors and search by name or specialization.
- Check doctor details, consultation fees, and available days.
- Select a date and view the available appointment slots.
- Book appointments without conflicting with already booked slots.
- View all bookings in the **My Appointments** section.
- Cancel or reschedule appointments if another slot is available.

### Admin / Receptionist

- View a dashboard with today's appointments, total bookings, completed visits, cancellations, and doctor-wise statistics.
- Add new doctors and set their specialization, working hours, available days, and appointment slot duration.
- Edit doctor details and update their schedules.
- View and manage all clinic appointments.
- Update appointment status from Booked to Checked-In, Completed, or Cancelled.
- Add diagnosis details and prescription notes to completed visits.

## Tech Stack

- **Frontend:** React, Vite, React Router DOM, CSS
- **Backend:** Node.js and Express.js
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** JWT and bcrypt for password hashing

## Project Structure

```text
assignment-6/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   └── doctors.js
│   ├── .env.example
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminAppointments.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminDoctorEdit.jsx
    │   │   ├── AdminDoctorNew.jsx
    │   │   ├── AppointmentDetail.jsx
    │   │   ├── DoctorDetail.jsx
    │   │   ├── Doctors.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyAppointments.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   └── index.css
    └── index.html
```

## How to Run the Project Locally

### 1. Set Up the Backend

Open a terminal and move to the backend folder:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

Create a `.env` file inside the `backend` folder and add the following configuration. Replace the MongoDB connection string and JWT secret with your own values.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_NAME=sauvi receptionist
ADMIN_EMAIL=###########
ADMIN_PASSWORD=##########
ADMIN_PHONE=###########
```

Run the seed script to add sample doctors and demo accounts to the database:

```bash
node seed.js
```

Start the backend server:

```bash
node server.js
```

The backend should now be available at `http://localhost:5001`.

### 2. Set Up the Frontend

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to use the application.

## API Endpoints

The backend provides the following APIs for authentication, doctor management, appointments, and clinic administration.

### Authentication – `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new patient |
| POST | `/api/auth/login` | Log in as a patient or admin |
| GET | `/api/auth/me` | Get the logged-in user's profile |

### Doctors – `/api/doctors`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | Get the list of doctors |
| GET | `/api/doctors/specializations` | Get available specializations |
| GET | `/api/doctors/:id` | Get details of a specific doctor |
| GET | `/api/doctors/:id/slots?date=YYYY-MM-DD` | Get available slots for a date |
| POST | `/api/doctors` | Add a doctor (Admin only) |
| PUT | `/api/doctors/:id` | Update doctor details (Admin only) |
| DELETE | `/api/doctors/:id` | Delete a doctor (Admin only) |

The doctor list also supports filtering by specialization and searching by name using the `specialization` and `search` query parameters.

### Appointments – `/api/appointments`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/appointments/my` | Get the logged-in patient's appointments |
| GET | `/api/appointments/:id` | Get appointment details |
| PUT | `/api/appointments/:id/cancel` | Cancel an appointment |
| PUT | `/api/appointments/:id/reschedule` | Reschedule an appointment |
| PUT | `/api/appointments/:id/status` | Update appointment status (Admin only) |
| PUT | `/api/appointments/:id/notes` | Add diagnosis and prescription notes (Admin only) |

### Admin – `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Get dashboard statistics and doctor-wise data |
| GET | `/api/admin/appointments` | View all appointments with filters |



You can also create a new patient account directly from the Register page.

**Note:** These are demo credentials for local testing only. Use a strong password and a secure JWT secret if deploying the project.
