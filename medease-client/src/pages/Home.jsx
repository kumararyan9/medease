import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Hero from "../components/Hero";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import TrustStats from "../components/TrustStats";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Partners from "../components/Partners";
import CtaSection from "../components/CtaSection";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <TrustStats />
      <SpecialityMenu />
      <WhyChooseUs />
      <HowItWorks />
      <TopDoctors />
      <Testimonials />
      <Partners />
      <CtaSection />
      <Banner />
    </motion.div>
  );
};

export default Home;
