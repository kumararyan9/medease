import { useContext, useEffect, useState, useCallback } from "react";
import { AdminContext } from "../../context/AdminContext";
import DoctorCard from "../../components/DoctorCard";
import DoctorEditDrawer from "../../components/DoctorEditDrawer";
import { motion } from "framer-motion";
import axios from "axios";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, backendUrl } = useContext(AdminContext);
  const [editDoctor, setEditDoctor] = useState(null);
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    getAllDoctors();
    axios
      .get(backendUrl + "/api/specialities")
      .then(({ data }) => {
        if (data.success) setSpecialities(data.specialities || []);
      })
      .catch(() => {});
  }, [aToken, getAllDoctors, backendUrl]);

  const handleSave = useCallback(
    async (docId, formData) => {
      const { data } = await axios.put(
        backendUrl + `/api/admin/update-doctor/${docId}`,
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        getAllDoctors();
      }
      return data;
    },
    [backendUrl, aToken, getAllDoctors]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="m-4 sm:m-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-[var(--foreground)]">All Doctors</h1>
        <span className="text-xs text-[var(--foreground)]/50 bg-[var(--muted-bg)] px-3 py-1 rounded-full">
          {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
        </span>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-20 text-[var(--foreground)]/40 text-sm">
          No doctors found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {doctors.map((doctor, index) => (
            <DoctorCard
              key={doctor._id || index}
              doctor={doctor}
              onEdit={setEditDoctor}
            />
          ))}
        </div>
      )}

      <DoctorEditDrawer
        doctor={editDoctor}
        onClose={() => setEditDoctor(null)}
        onSave={handleSave}
        specialities={specialities}
      />
    </motion.div>
  );
};

export default DoctorsList;
