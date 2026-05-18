import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-[var(--background)]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
          403
        </h1>
        <p className="text-2xl mt-4 text-gray-600 font-semibold">
          Access Denied
        </p>
        <p className="text-gray-500 mt-2">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-full hover:bg-[var(--primary-hover)] transition-colors"
        >
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default NotAuthorized;
