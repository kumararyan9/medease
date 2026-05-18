import { motion } from "framer-motion";

const DoctorCard = ({ doctor, index = 0 }) => {
  const handleClick = () => {
    window.location.href = `/appointment/${doctor._id}`;
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer transition-colors duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10 ${
        doctor.available ? "" : "opacity-50"
      }`}
    >
      <img
        className="bg-[var(--muted-bg)] w-full"
        src={doctor.image}
        alt={doctor.name}
      />
      <div className="p-4 bg-[var(--card-bg)]">
        <div className="flex items-center gap-2 text-sm text-center">
          <motion.p
            animate={{ scale: doctor.available ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className={`w-2 h-2 rounded-full ${
              doctor.available ? "bg-green-500" : "bg-gray-400"
            }`}
          ></motion.p>
          <p className={doctor.available ? "text-green-500" : "text-gray-400"}>
            {doctor.available ? "Available" : "Not Available"}
          </p>
        </div>
        <p className="text-[var(--foreground)] text-lg font-medium">
          {doctor.name}
        </p>
        <p className="text-gray-500 text-sm">{doctor.speciality}</p>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
