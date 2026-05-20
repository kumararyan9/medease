import { assets } from "../assets/assets_frontend/assets";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center text-2xl pt-10 text-[var(--foreground)] uppercase">
        <p>
          Contact <span className="text-[var(--foreground)] font-medium">Us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-10 justify-center mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 items-start">
          <p className="font-semibold text-lg text-[var(--foreground)] uppercase">
            Our Office
          </p>
          <p className="text-[var(--foreground)]">
            SAS Nagar Mohali, Punjab
            <br />
            India — 140308
          </p>
          <p className="text-[var(--foreground)]">
            Tel: +91 8146812736
            <br />
            Email: support@medease.in
          </p>
          <p className="font-semibold text-lg text-[var(--foreground)] uppercase">
            Careers at MedEase
          </p>
          <p className="text-[var(--foreground)]">
            Learn more about our teams and job openings.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[var(--primary)] text-[var(--primary)] px-8 py-4 text-sm hover:bg-[var(--primary)] hover:text-white transition-all duration-500 cursor-pointer"
          >
            Explore Jobs
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
