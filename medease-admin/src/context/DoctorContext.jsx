import axios from "axios";
import { useState, createContext } from "react";
import { toast } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContext = createContext();

function fmtSlotDate(d) {
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}_${mm}_${yyyy}`;
}

function fmtSlotTime(d) {
  const date = new Date(d);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function transformAppointment(apt) {
  return {
    _id: apt._id,
    userData: {
      image: apt.patientId?.image || "",
      name: apt.patientId?.name || "",
      dob: apt.patientId?.dob || "",
    },
    slotDate: fmtSlotDate(apt.slotStart),
    slotTime: fmtSlotTime(apt.slotStart),
    amount: apt.paymentAmount || 0,
    payment: apt.paymentStatus === "PAID",
    cancelled: apt.status === "CANCELLED",
    isCompleted: apt.status === "COMPLETED",
  };
}

function transformProfile(profile) {
  return {
    ...profile,
    speciality: profile.speciality?.name || profile.speciality || "",
    fees: profile.consultationFee || 0,
    experience: profile.experienceYears
      ? `${profile.experienceYears} ${profile.experienceYears === 1 ? "year" : "years"}`
      : "",
    address: profile.address || { line1: "", line2: "" },
  };
}

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointments", {
        headers: { dToken },
      });
      if (data.success && data.appointments) {
        setAppointments(data.appointments.map(transformAppointment));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success && data.dashData) {
        const dd = data.dashData;
        setDashData({
          earning: dd.earnings || 0,
          appointments: dd.appointments || 0,
          patients: dd.patients || 0,
          latestAppointments: (dd.latestAppointments || []).map(transformAppointment),
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success && data.profileData) {
        setProfileData(transformProfile(data.profileData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};
