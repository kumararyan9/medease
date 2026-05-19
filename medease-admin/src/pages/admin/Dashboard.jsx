import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { aToken, cancelAppointment, dashData, getDashData } =
    useContext(AdminContext);
  const { formatDateString } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);
  return (
    dashData && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="m-5"
      >
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[var(--card-bg)] p-4 min-w-52 rounded border-2 border-[var(--border)] cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-[var(--foreground)]">
                {dashData.doctors}
              </p>
              <p className="text-[var(--foreground)]">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[var(--card-bg)] p-4 min-w-52 rounded border-2 border-[var(--border)] cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointment_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-[var(--foreground)]">
                {dashData.appointments}
              </p>
              <p className="text-[var(--foreground)]">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[var(--card-bg)] p-4 min-w-52 rounded border-2 border-[var(--border)] cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-[var(--foreground)]">
                {dashData.patients}
              </p>
              <p className="text-[var(--foreground)]">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)]">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-[var(--border)]">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">latest Appointments</p>
          </div>
          <div className="border border-t-0 border-[var(--border)]">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-[var(--muted-bg)]"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-[var(--foreground)] font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-[var(--foreground)]">
                    {formatDateString(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  );
};

export default Dashboard;
