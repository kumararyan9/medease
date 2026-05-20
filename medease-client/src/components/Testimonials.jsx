import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    text: "MedEase made it so easy to find the right specialist. I booked my appointment in minutes and the doctor was incredibly thorough.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Patient",
    text: "The video consultation feature is a lifesaver. I can consult with my doctor without leaving home. Highly recommend!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Patient",
    text: "Finally a platform that connects you with verified doctors. The booking process is smooth and the reminders are very helpful.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Testimonials = () => {
  return (
    <div className="my-16 md:mx-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-medium text-center text-[var(--foreground)]"
      >
        What Our Patients Say
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sm:w-1/3 text-center text-sm text-gray-500 mx-auto mt-2"
      >
        Real stories from real patients who trust MedEase.
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
      >
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="border border-[var(--border)] rounded-xl bg-[var(--card-bg)] p-6 hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: item.rating }).map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-[var(--primary)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              &ldquo;{item.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--muted-bg)] flex items-center justify-center text-xs font-medium text-[var(--primary)]">
                {item.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;
