import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import NotAuthorized from "../pages/auth/NotAuthorized";

const DoctorLayout = () => (
  <div className="min-h-screen flex flex-col bg-[var(--background)]">
    <Navbar />
    <div className="flex items-start flex-1">
      <Sidebar />
      <Routes>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="profile" element={<DoctorProfile />} />

        <Route path="*" element={<NotAuthorized />} />
      </Routes>
    </div>
    <footer className="text-center py-4 text-sm text-[var(--foreground)] border-t bg-[var(--card-bg)] border-[var(--border)]">
      Made by <span className="font-semibold">Kumar Aryan</span> &nbsp;|&nbsp; © {new Date().getFullYear()} MedEase
    </footer>
  </div>
);

export default DoctorLayout;
