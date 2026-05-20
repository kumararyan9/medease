import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { ListIcon, TickIcon, CancelIcon } from "../../components/Icons";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currencySymbol, formatDateString } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dToken]);

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
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-[var(--foreground)]">
                {currencySymbol} {dashData.earning}
              </p>
              <p className="text-[var(--foreground)]">Earnings</p>
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
            <ListIcon className="w-[22px] h-[22px] text-[var(--foreground)]" />
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
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-[var(--foreground)] font-medium">
                    {item.userData.name}
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
                  <div className="flex">
                    <CancelIcon
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer text-red-400"
                    />
                    <TickIcon
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer text-green-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  );
};

export default DoctorDashboard;
