import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Hero from "../components/Hero";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </motion.div>
  );
};

export default Home;
