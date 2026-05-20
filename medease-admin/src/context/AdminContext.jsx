import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

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
    docData: {
      image: apt.doctorId?.image || "",
      name: apt.doctorId?.name || "",
      fees: apt.paymentAmount || 0,
    },
    slotDate: fmtSlotDate(apt.slotStart),
    slotTime: fmtSlotTime(apt.slotStart),
    amount: apt.paymentAmount || 0,
    payment: apt.paymentStatus === "PAID",
    cancelled: apt.status === "CANCELLED",
    isCompleted: apt.status === "COMPLETED",
  };
}

function transformDoctor(doc) {
  return {
    _id: doc._id,
    name: doc.name,
    image: doc.image || "",
    phone: doc.phone || "",
    speciality: doc.speciality?.name || doc.speciality || "",
    degree: doc.degree || "",
    experienceYears: doc.experienceYears || 0,
    about: doc.about || "",
    fees: doc.consultationFee || 0,
    consultationFee: doc.consultationFee || 0,
    address: doc.address || { line1: "", line2: "" },
    available: doc.available !== undefined ? doc.available : true,
    languages: doc.languages || [],
    ratingAverage: doc.ratingAverage || 0,
  };
}

export const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { aToken },
      });
      if (data.success && data.doctors) {
        setDoctors(data.doctors.map(transformDoctor));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change availability");
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success && data.appointments) {
        setAppointments(data.appointments.map(transformAppointment));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success && data.dashData) {
        const dd = data.dashData;
        setDashData({
          doctors: dd.doctors || 0,
          patients: dd.patients || 0,
          appointments: dd.appointments || 0,
          latestAppointments: (dd.latestAppointments || []).map(transformAppointment),
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load Dashboard data");
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
