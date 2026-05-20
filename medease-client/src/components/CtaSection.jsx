import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[var(--primary)] rounded-xl px-6 sm:px-10 md:px-14 lg:px-12 my-16 md:mx-10"
    >
      <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-16 gap-8">
        <div className="text-center md:text-left">
          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight">
            Your health deserves <br className="hidden sm:block" /> expert care.
          </p>
          <p className="text-white/80 text-sm sm:text-base mt-3 max-w-lg">
            Book trusted doctors instantly and take the first step toward better health.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="bg-white text-[var(--primary)] px-8 py-3 rounded-full font-medium text-sm sm:text-base cursor-pointer whitespace-nowrap hover:shadow-lg transition-all"
        >
          Find a Doctor
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CtaSection;
