import { motion } from "framer-motion";
import { assets } from "../assets/assets_frontend/assets";

const partners = [
  { name: "Apollo", icon: assets.verified_icon },
  { name: "Fortis", icon: assets.verified_icon },
  { name: "Max", icon: assets.verified_icon },
  { name: "Medanta", icon: assets.verified_icon },
  { name: "AIIMS", icon: assets.verified_icon },
];

const Partners = () => {
  return (
    <div className="my-16 md:mx-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-lg font-medium text-center text-[var(--foreground)] mb-8"
      >
        Trusted by Leading Healthcare Providers
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
      >
        {partners.map((partner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="flex items-center gap-2 px-5 py-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)]"
          >
            <img className="w-5 h-5" src={partner.icon} alt="" />
            <span className="text-sm font-medium text-gray-500">
              {partner.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Partners;
