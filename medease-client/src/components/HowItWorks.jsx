import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Search Doctor",
    desc: "Browse through our extensive list of trusted doctors by specialty or name.",
  },
  {
    number: "02",
    title: "Book Appointment",
    desc: "Select your preferred date and time slot, then confirm your booking.",
  },
  {
    number: "03",
    title: "Get Consultation",
    desc: "Visit the clinic or connect via video call for your consultation.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorks = () => {
  return (
    <div className="my-16 md:mx-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-medium text-center text-[var(--foreground)]"
      >
        How It Works
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:w-1/3 text-center text-sm text-gray-500 mx-auto mt-2"
      >
        Your healthcare journey in three simple steps.
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 md:gap-12 mt-12"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex-1 max-w-xs mx-auto w-full"
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--muted-bg)] flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-[var(--primary)]">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HowItWorks;
