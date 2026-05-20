import { useNavigate } from "react-router-dom";
import { specialityData } from "../assets/assets_frontend/assets";
import { motion } from "framer-motion";

const SpecialityMenu = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-[var(--foreground)]"
      id="speciality"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-medium"
      >
        Find by Speciality
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:w-1/3 text-center text-sm"
      >
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </motion.p>
      <div className="flex sm:justify-center gap-4 sm:gap-6 pt-5 w-full overflow-x-auto pb-2">
        {specialityData.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.08 } }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05, transition: { type: "spring", stiffness: 500, damping: 15 } }}
            onClick={() => {
              navigate(`/doctors/${item.slug}`);
              setTimeout(() => {
                scrollTo(0, 0);
              }, 100);
            }}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 group"
            key={index}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-[var(--muted-bg)] flex items-center justify-center mb-2 group-hover:bg-[var(--primary)]/10 transition-colors duration-300">
              <img className="w-10 sm:w-16" src={item.image} alt="" />
            </div>
            <p className="text-[var(--foreground)] font-medium">{item.speciality}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
