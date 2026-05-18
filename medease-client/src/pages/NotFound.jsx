import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[80vh] bg-[var(--muted-bg)] rounded-lg">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] mb-4"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-[var(--foreground)] mb-2"
      >
        Oops! Page not found.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--foreground)] mb-6 max-w-md"
      >
        It seems like you're lost in the internet cosmos. Let's get you back to
        the homepage!
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 inline-block"
        >
          Back to Home
        </Link>
      </motion.div>

    </div>
  );
};

export default NotFound;
