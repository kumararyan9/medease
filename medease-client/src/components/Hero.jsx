import { assets } from "../assets/assets_frontend/assets";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Hero = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col md:flex-row flex-wrap bg-[var(--primary)] rounded-lg px-6 md:px-10 lg:px-20"
    >
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <motion.p
          variants={itemVariants}
          className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight"
        >
          Book Appointment <br /> With Trusted Doctors
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light"
        >
          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" /> schedule your appointment
            hassle-free.
          </p>
        </motion.div>
        <motion.a
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          href="#speciality"
          className="group flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 transition-all duration-300"
        >
          Book Appointment
          <img
            className="w-3 transition-transform duration-300 group-hover:translate-x-2"
            src={assets.arrow_icon}
            alt=""
          />
        </motion.a>
      </div>

      <motion.div
        variants={itemVariants}
        className="md:w-1/2 relative"
      >
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt=""
        />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
