import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const { backendUrl, setToken, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("log in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message || "Failed to create account");
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Logged in successfully!");
        } else {
          toast.error(data.message || "Failed to log in");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex flex-col items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340] sm:min-w-96 border rounded-xl text-sm shadow-lg bg-[var(--card-bg)] border-[var(--border)]">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-500">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment!
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border rounded w-full p-2 mt-1 bg-[var(--card-bg)] border-[var(--border)]"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border rounded w-full p-2 mt-1 bg-[var(--card-bg)] border-[var(--border)]"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input
            className="border rounded w-full p-2 mt-1 bg-[var(--card-bg)] border-[var(--border)] pr-10"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[34px] text-gray-500 cursor-pointer"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-[var(--primary)] text-white w-full py-2 rounded-md text-base cursor-pointer"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </motion.button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[var(--primary)] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-[var(--primary)] underline cursor-pointer"
            >
              Sign-up here
            </span>
          </p>
        )}
      </div>
      <p className="mt-10 text-gray-500 text-center w-full">
        Are you a Doctor or Admin?{" "}
        <a
          href={import.meta.env.VITE_ADMIN_URL || "/admin"}
          className="text-[var(--primary)] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Login here
        </a>
      </p>
    </motion.form>
  );
};

export default Login;
