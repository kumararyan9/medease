import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Appointments Booked" },
  { value: "500+", label: "Verified Doctors" },
  { value: "24/7", label: "Support" },
  { value: "98%", label: "Patient Satisfaction" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TrustStats = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-16 md:mx-10"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="border border-[var(--border)] rounded-xl bg-[var(--card-bg)] p-6 md:p-8 text-center hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300"
        >
          <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
            {stat.value}
          </p>
          <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrustStats;
