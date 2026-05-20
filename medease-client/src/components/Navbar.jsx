import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useTheme } from "../context/useTheme";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "All Doctors", path: "/doctors" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, setToken, userData } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const logoutFunc = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between text-sm py-4 mb-5 border-b bg-[var(--card-bg)] border-[var(--border)] sticky top-0 z-50"
    >
      <Link to="/">
        <img
          className="w-44 cursor-pointer"
          src={theme === "dark" ? assets.logo_dark : assets.logo}
          alt="MedEase"
        />
      </Link>
      <ul className="hidden md:flex items-start gap-5 font-medium uppercase">
        {navLinks.map((nav, index) => (
          <NavLink key={index} to={nav.path} className="relative">
            <li className="py-1">{nav.title}</li>
            {isActive(nav.path) && (
              <motion.hr
                layoutId="activeNav"
                className="border-none outline-none h-0.5 bg-[var(--primary)] w-3/5 m-auto"
              />
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-4">
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

        {token && userData ? (
          <div
            className="flex items-center gap-2 cursor-pointer group relative"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <img
              className="w-8 rounded-full"
              src={userData.image || assets.upload_area}
              alt="user profile pic"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20"
                >
                  <div className="min-w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded flex flex-col gap-4 p-4 shadow-lg">
                    <p
                      onClick={() => navigate("/profile")}
                      className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/my-appointments")}
                      className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                    >
                      My Appointments
                    </p>
                    <p
                      onClick={logoutFunc}
                      className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                    >
                      Logout
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Login
          </motion.button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 cursor-pointer md:hidden"
          src={assets.menu_icon}
          alt="menu icon"
        />

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-20 overflow-hidden bg-[var(--card-bg)] w-full md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-6">
                <Link onClick={() => setShowMenu(false)} to="/">
                  <img
                    className="w-36"
                    src={theme === "dark" ? assets.logo_dark : assets.logo}
                    alt="MedEase"
                  />
                </Link>
                <img
                  className="w-7 cursor-pointer"
                  onClick={() => setShowMenu(false)}
                  src={assets.cross_icon}
                  alt="cross icon"
                />
              </div>
              <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
                {navLinks.map((nav, index) => (
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    key={index}
                    to={nav.path}
                  >
                    <motion.p
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded inline-block"
                    >
                      {nav.title}
                    </motion.p>
                  </NavLink>
                ))}

                {!token && (
                  <li>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/login");
                      }}
                      className={`px-6 py-2 rounded cursor-pointer ${
                        location.pathname === "/login"
                          ? "bg-[var(--primary)] text-white"
                          : "bg-transparent"
                      }`}
                    >
                      Login
                    </motion.button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;
