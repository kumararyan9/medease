import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/admin/Dashboard";
import AllAppointments from "../pages/admin/AllAppointments";
import AddDoctor from "../pages/admin/AddDoctor";
import DoctorsList from "../pages/admin/DoctorsList";
import NotAuthorized from "../pages/auth/NotAuthorized";

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col bg-[var(--background)]">
    <Navbar />
    <div className="flex items-start flex-1">
      <Sidebar />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="all-appointments" element={<AllAppointments />} />
        <Route path="add-doctor" element={<AddDoctor />} />
        <Route path="doctors-list" element={<DoctorsList />} />

        <Route path="*" element={<NotAuthorized />} />
      </Routes>
    </div>
    <footer className="text-center py-4 text-sm text-[var(--foreground)] border-t bg-[var(--card-bg)] border-[var(--border)]">
      Made by <span className="font-semibold">Kumar Aryan</span> &nbsp;|&nbsp; © {new Date().getFullYear()} MedEase
    </footer>
  </div>
);

export default AdminLayout;
