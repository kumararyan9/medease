import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import DoctorCard from "../../components/DoctorCard";
import { motion } from "framer-motion";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors } = useContext(AdminContext);

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="m-5 max-h-[90vh] overflow-y-scroll"
    >
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>
    </motion.div>
  );
};

export default DoctorsList;
