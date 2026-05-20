import { assets } from "../assets/assets_frontend/assets";
import { useTheme } from "../context/useTheme";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className="md:mx-10 mt-16 md:mt-24">
      <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-14 my-10 text-sm">
        <div>
          <img
            className="mb-5 w-36 sm:w-40"
            src={theme === "dark" ? assets.logo_dark : assets.logo}
            alt="MedEase"
          />
          <p className="w-full md:w-4/5 text-gray-500 leading-6">
            MedEase is your trusted partner in managing your healthcare needs
            conveniently and efficiently. We connect you with trusted doctors
            and streamline your healthcare journey.
          </p>
        </div>

        <div>
          <p className="text-base sm:text-lg font-medium mb-4 text-[var(--foreground)]">
            COMPANY
          </p>
          <ul className="flex flex-col gap-2.5 text-gray-500">
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">Home</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">About us</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">Contact us</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-base sm:text-lg font-medium mb-4 text-[var(--foreground)]">
            FOR PATIENTS
          </p>
          <ul className="flex flex-col gap-2.5 text-gray-500">
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">Find a Doctor</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">Book Appointment</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">My Appointments</li>
            <li className="hover:text-[var(--primary)] cursor-pointer transition-colors">FAQs</li>
          </ul>
        </div>

        <div>
          <p className="text-base sm:text-lg font-medium mb-4 text-[var(--foreground)]">
            GET IN TOUCH
          </p>
          <ul className="flex flex-col gap-2.5 text-gray-500">
            <li>+91 98765 43210</li>
            <li>support@medease.in</li>
            <li className="flex gap-3 mt-2">
              <span className="w-8 h-8 rounded-full bg-[var(--muted-bg)] flex items-center justify-center cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </span>
              <span className="w-8 h-8 rounded-full bg-[var(--muted-bg)] flex items-center justify-center cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </span>
              <span className="w-8 h-8 rounded-full bg-[var(--muted-bg)] flex items-center justify-center cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12 24 5.373 18.627 0 12 0z"/></svg>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-[var(--border)]" />
        <p className="py-5 text-sm text-center text-gray-500">
          Made by{" "}
          <span className="font-semibold text-[var(--foreground)]">
            Kumar Aryan
          </span>{" "}
          &nbsp;|&nbsp; Copyright &copy; {new Date().getFullYear()} MedEase. All
          rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
