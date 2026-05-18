import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "./DoctorCard";
import { motion } from "framer-motion";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[var(--foreground)] md:mx-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-medium"
      >
        Top Doctors to Book
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:w-1/3 text-center text-sm"
      >
        Simply browse through our extensive list of trusted doctors.
      </motion.p>
      <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} index={index} />
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          navigate("/doctors");
          setTimeout(() => {
            scrollTo(0, 0);
          }, 50);
        }}
        className="bg-[var(--muted-bg)] text-[var(--foreground)] px-12 py-3 rounded-full mt-10 cursor-pointer border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
      >
        More
      </motion.button>
    </div>
  );
};

export default TopDoctors;
