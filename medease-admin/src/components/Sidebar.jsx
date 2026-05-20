import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { HomeIcon, AppointmentIcon, AddIcon, PeopleIcon } from "./Icons";

const adminNavLinks = [
  { to: "/admin/dashboard", icon: "home", label: "Dashboard" },
  {
    to: "/admin/all-appointments",
    icon: "appointment",
    label: "All Appointments",
  },
  { to: "/admin/add-doctor", icon: "add", label: "Add Doctor" },
  { to: "/admin/doctors-list", icon: "home", label: "Doctor List" },
];

const doctorNavLinks = [
  { to: "/doctor/dashboard", icon: "home", label: "Dashboard" },
  {
    to: "/doctor/appointments",
    icon: "appointment",
    label: "My Appointments",
  },
  { to: "/doctor/profile", icon: "people", label: "Profile" },
];

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className="min-h-screen bg-[var(--card-bg)] border-r border-[var(--border)]">
      {(aToken || dToken) && (
        <ul className="text-[var(--foreground)] mt-5">
          {(aToken ? adminNavLinks : doctorNavLinks).map(
            ({ to, icon, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-60 lg:min-w-72 cursor-pointer ${
                    isActive ? "bg-[var(--muted-bg)] border-r-4 border-[var(--primary)]" : ""
                  }`
                }
                key={to}
                to={to}
              >
                {icon === "home" && <HomeIcon className="w-[23px] h-[23px] text-[var(--foreground)]" />}
                {icon === "appointment" && <AppointmentIcon className="w-[24px] h-[23px] text-[var(--foreground)]" />}
                {icon === "add" && <AddIcon className="w-[24px] h-[24px] text-[var(--foreground)]" />}
                {icon === "people" && <PeopleIcon className="w-[24px] h-[24px] text-[var(--foreground)]" />}
                <p className="hidden md:block">{label}</p>
              </NavLink>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
