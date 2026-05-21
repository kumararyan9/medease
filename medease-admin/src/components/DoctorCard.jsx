import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { motion } from "framer-motion";
import Avatar from "./Avatar";

const DoctorCard = ({ doctor, onEdit }) => {
  const { changeAvailability } = useContext(AdminContext);
  const [updating, setUpdating] = useState(false);

  const handleToggle = async () => {
    setUpdating(true);
    await changeAvailability(doctor._id);
    setUpdating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-md hover:shadow-[var(--primary)]/5 hover:border-[var(--primary)]/20 transition-all duration-300 group"
    >
      {/* Image Section */}
      <div className="relative bg-gradient-to-b from-[var(--muted-bg)] to-[var(--muted-bg)]/60 px-4 pt-6 pb-4 flex justify-center">
        <Avatar
          src={doctor.image}
          name={doctor.name}
          size="2xl"
          className="ring-4 ring-[var(--card-bg)] shadow-sm"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              doctor.available
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                doctor.available ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="text-[var(--foreground)] font-semibold text-sm leading-tight truncate">
            {doctor.name}
          </h3>
          <p className="text-[var(--foreground)]/60 text-xs mt-0.5 truncate">
            {doctor.speciality || "General"}
          </p>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--foreground)]/50">
          {doctor.experienceYears > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {doctor.experienceYears}yrs
            </span>
          )}
          {doctor.degree && (
            <span className="truncate">{doctor.degree}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]/50">
          <button
            onClick={() => onEdit?.(doctor)}
            className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--muted-bg)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleToggle}
            disabled={updating}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer disabled:opacity-50 ${
              doctor.available
                ? "border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "border-emerald-200 dark:border-emerald-900/50 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            }`}
          >
            {updating ? "..." : doctor.available ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
