import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

const Appointments = () => {
  const { backendUrl, token, getDoctorsData, currencySymbol } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [modalContext, setModalContext] = useState(null);

  const formatDateString = (dateStr) => {
    const [day, month, year] = dateStr.split("_");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        const transformed = (data.appointments || []).map((apt) => {
          if (apt.docData) return apt;
          const docUser = apt.doctorId || {};
          const slotDate = new Date(apt.slotStart);
          const dd = String(slotDate.getDate()).padStart(2, "0");
          const mm = String(slotDate.getMonth() + 1).padStart(2, "0");
          const yyyy = slotDate.getFullYear();
          const hours = slotDate.getHours();
          const mins = String(slotDate.getMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          const h12 = hours % 12 || 12;
          return {
            _id: apt._id,
            docData: {
              image: docUser.image || "",
              name: docUser.name || "",
              speciality: docUser.speciality || "",
              address: docUser.address || { line1: "", line2: "" },
              consultationFee: apt.paymentAmount || 0,
              fees: apt.paymentAmount || 0,
            },
            slotDate: `${dd}_${mm}_${yyyy}`,
            slotTime: `${String(h12).padStart(2, "0")}:${mins} ${ampm}`,
            amount: apt.paymentAmount || 0,
            payment: apt.paymentStatus === "PAID",
            cancelled: apt.status === "CANCELLED",
            isCompleted: apt.status === "COMPLETED",
          };
        });
        setAppointments(transformed.reverse());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }, [backendUrl, token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message || "Appointment cancelled successfully");
        getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  const makePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/make-payment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message || "Payment successful");
        getUserAppointments();
        setModalContext(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make payment");
    }
  };

  const handlePayClick = (appointmentId) => {
    setModalContext({ type: "payment", appointmentId });
  };

  const handleCancelClick = (appointmentId) => {
    setModalContext({ type: "cancel", appointmentId });
  };

  const getSelectedAppointment = () => {
    if (!modalContext) return null;
    return appointments.find((a) => a._id === modalContext.appointmentId);
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, getUserAppointments]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className="pb-3 mt-12 font-medium text-[var(--foreground)] border-b border-[var(--border)]">
        My Appointments
      </p>
      {appointments.length === 0 ? (
        <p className="text-center text-[var(--foreground)] mt-20 text-sm">
          No appointments yet.
        </p>
      ) : null}
      <div>
        {appointments.map((doc, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4 border-b border-[var(--border)]"
            key={index}
          >
            <div className="flex-shrink-0">
              <img
                className="w-full sm:w-32 aspect-square object-cover bg-[var(--muted-bg)] rounded"
                src={doc.docData.image || null}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-[var(--foreground)] space-y-0.5">
              <p className="text-base font-semibold">{doc.docData.name}</p>
              <p className="text-[var(--foreground)]/70">
                {doc.docData.speciality?.name || doc.docData.speciality}
              </p>
              <p className="font-medium mt-2">Address:</p>
              <p className="text-xs text-[var(--foreground)]/70">
                {doc.docData.address.line1}
              </p>
              <p className="text-xs text-[var(--foreground)]/70">
                {doc.docData.address.line2}
              </p>
              <p className="text-xs mt-2">
                <span className="text-sm font-medium">Date & Time:</span>{" "}
                <span className="text-[var(--foreground)]/70">
                  {formatDateString(doc.slotDate)} | {doc.slotTime}
                </span>
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 sm:justify-end sm:min-w-40">
              {!doc.payment && !doc.cancelled && !doc.isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayClick(doc._id)}
                  className="flex-1 sm:flex-none text-sm text-center py-2 px-4 border rounded hover:bg-[var(--primary)] hover:text-white transition-all duration-300 cursor-pointer border-[var(--border)] text-[var(--foreground)]/70 hover:border-[var(--primary)]"
                >
                  Pay Online
                </motion.button>
              )}

              {doc.payment && !doc.cancelled && !doc.isCompleted && (
                <button className="flex-1 sm:flex-none text-sm text-white bg-green-600 text-center py-2 px-4 rounded cursor-pointer">
                  Payment Completed
                </button>
              )}

              {!doc.cancelled && !doc.isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCancelClick(doc._id)}
                  className="flex-1 sm:flex-none text-sm text-center py-2 px-4 border rounded hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 cursor-pointer border-[var(--border)] text-[var(--foreground)]/70"
                >
                  Cancel appointment
                </motion.button>
              )}

              {doc.cancelled && !doc.isCompleted && (
                <button className="flex-1 sm:flex-none text-sm text-red-500 text-center py-2 px-4 border border-red-500/30 bg-red-500/5 rounded cursor-pointer">
                  Appointment Cancelled
                </button>
              )}

              {doc.isCompleted && (
                <button className="flex-1 sm:flex-none text-sm text-green-600 text-center py-2 px-4 border border-green-600/30 bg-green-600/5 rounded cursor-pointer">
                  Completed
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalContext && getSelectedAppointment() && (
          <ConfirmModal
            title={
              modalContext.type === "payment"
                ? "Confirm Payment"
                : "Cancel Appointment"
            }
            message={
              modalContext.type === "payment"
                ? `Do you want to proceed with the consultation fee of ${currencySymbol}${
                    getSelectedAppointment().docData.consultationFee || getSelectedAppointment().docData.fees
                  }?`
                : "Are you sure you want to cancel this appointment?"
            }
            confirmText={
              modalContext.type === "payment" ? "Make Payment" : "Yes, Cancel"
            }
            cancelText={modalContext.type === "payment" ? "Cancel" : "No"}
            onConfirm={() => {
              modalContext.type === "payment"
                ? makePayment(modalContext.appointmentId)
                : cancelAppointment(modalContext.appointmentId);
              setModalContext(null);
            }}
            onCancel={() => setModalContext(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointments;
