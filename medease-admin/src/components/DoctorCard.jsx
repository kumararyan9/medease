import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor }) => {
  const { changeAvailability } = useContext(AdminContext);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="border border-[var(--border)] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
    >
      <img
        className="bg-[var(--muted-bg)] group-hover:bg-[var(--primary)] transition-all duration-500"
        src={doctor.image}
        alt={doctor.name}
      />
      <div className="p-4 bg-[var(--card-bg)]">
        <p className="text-neutral-800 text-lg font-medium">{doctor.name}</p>
        <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
        <div className="flex items-center mt-2 gap-1 text-sm">
          <input
            onChange={() => changeAvailability(doctor._id)}
            type="checkbox"
            checked={doctor.available}
          />
          <p>Available</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
