import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const { theme, toggleTheme } = useTheme();

  const logoutHandler = () => {
    setAToken("");
    localStorage.removeItem("aToken");
    setDToken("");
    localStorage.removeItem("dToken");
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-[var(--card-bg)] border-[var(--border)]"
    >
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="MedEase Admin"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-500">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logoutHandler}
          className="cursor-pointer bg-[var(--primary)] text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Navbar;
