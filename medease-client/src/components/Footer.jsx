import { assets } from "../assets/assets_frontend/assets";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img
            className="mb-5 w-40"
            src={theme === "dark" ? assets.logo_dark : assets.logo}
            alt="MedEase"
          />
          <p className="w-full md:w-2/3 text-gray-500 leading-6">
            MedEase is your trusted partner in managing your healthcare needs
            conveniently and efficiently. We connect you with trusted doctors
            and streamline your healthcare journey.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-500">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-500">
            <li>+91 98765 43210</li>
            <li>support@medease.in</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-[var(--border)]" />
        <p className="py-5 text-sm text-center text-gray-500">
          Made by{" "}
          <span className="font-bold text-[var(--foreground)]">
            Kumar Aryan
          </span>{" "}
          &nbsp;|&nbsp; Copyright © {new Date().getFullYear()} MedEase. All
          rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
