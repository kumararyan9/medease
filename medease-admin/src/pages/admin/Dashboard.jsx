import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { ListIcon, CancelIcon } from "../../components/Icons";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Dashboard = () => {
  const { aToken, cancelAppointment, dashData, getDashData } = useContext(AdminContext);
  const { currencySymbol, formatDateString } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aToken]);

  if (!dashData) return null;

  const { doctors, patients, appointments, revenue, appointmentStatus, monthlyAnalytics, latestAppointments } = dashData;
  const maxMonthly = Math.max(...(monthlyAnalytics?.map((m) => m.appointments) || [1]), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="m-4 sm:m-5 w-full"
    >
      <h1 className="text-xl font-semibold text-[var(--foreground)] mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Doctors" value={doctors} color="from-emerald-500 to-teal-600" />
        <StatCard label="Patients" value={patients} color="from-blue-500 to-indigo-600" />
        <StatCard label="Appointments" value={appointments} color="from-violet-500 to-purple-600" />
        <StatCard
          label="Revenue"
          value={`${currencySymbol} ${(revenue?.collectedRevenue || 0).toLocaleString()}`}
          color="from-amber-500 to-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Appointment Status */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Appointment Status</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Pending", key: "PENDING", color: "bg-yellow-400" },
              { label: "Confirmed", key: "CONFIRMED", color: "bg-blue-400" },
              { label: "Completed", key: "COMPLETED", color: "bg-green-400" },
              { label: "Cancelled", key: "CANCELLED", color: "bg-red-400" },
              { label: "No Show", key: "NO_SHOW", color: "bg-gray-400" },
            ].map(({ label, key, color }) => {
              const count = appointmentStatus?.[key] || 0;
              const total = Object.values(appointmentStatus || {}).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-20 sm:w-24 text-xs text-[var(--foreground)]/70 shrink-0">{label}</span>
                  <div className="flex-1 h-2.5 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground)] w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Analytics */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Monthly Appointments</h3>
          {monthlyAnalytics?.length > 0 ? (
            <div className="flex items-end gap-1.5 sm:gap-2 h-40">
              {monthlyAnalytics.map((m, i) => {
                const height = (m.appointments / maxMonthly) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-medium text-[var(--foreground)]/60">{m.appointments}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="w-full rounded-t-md bg-[var(--primary)]/80 hover:bg-[var(--primary)] transition-colors cursor-pointer"
                    />
                    <span className="text-[9px] text-[var(--foreground)]/50">{MONTH_NAMES[m.month] || m.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--foreground)]/50 text-center py-10">No monthly data yet</p>
          )}
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 mb-8">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RevenueTile label="Total Revenue" value={`${currencySymbol} ${(revenue?.totalRevenue || 0).toLocaleString()}`} color="text-emerald-500" />
          <RevenueTile label="Collected" value={`${currencySymbol} ${(revenue?.collectedRevenue || 0).toLocaleString()}`} color="text-green-500" />
          <RevenueTile label="Pending" value={`${currencySymbol} ${(revenue?.pendingRevenue || 0).toLocaleString()}`} color="text-amber-500" />
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-[var(--border)]">
          <ListIcon className="w-[22px] h-[22px] text-[var(--foreground)]" />
          <p className="font-semibold text-sm text-[var(--foreground)]">Latest Appointments</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {latestAppointments?.length > 0 ? latestAppointments.map((item, index) => (
            <div className="flex items-center px-4 sm:px-6 py-3 gap-3 hover:bg-[var(--muted-bg)]/50 transition-colors" key={index}>
              <img className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover border border-[var(--border)]" src={item.docData?.image} alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.docData?.name}</p>
                <p className="text-xs text-[var(--foreground)]/60">{item.slotDate ? formatDateString(item.slotDate) : ""}</p>
              </div>
              <div className="shrink-0">
                {item.cancelled ? (
                  <span className="text-[11px] font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="text-[11px] font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Completed</span>
                ) : (
                  <CancelIcon onClick={() => cancelAppointment(item._id)} className="w-8 h-8 cursor-pointer text-red-400 hover:text-red-500 transition-colors" />
                )}
              </div>
            </div>
          )) : (
            <p className="text-sm text-[var(--foreground)]/50 text-center py-8">No appointments yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 sm:p-5 text-white shadow-lg`}
  >
    <p className="text-2xl sm:text-3xl font-bold">{value}</p>
    <p className="text-xs sm:text-sm text-white/80 mt-1">{label}</p>
  </motion.div>
);

const RevenueTile = ({ label, value, color }) => (
  <div className="bg-[var(--muted-bg)] rounded-lg p-4">
    <p className="text-xs text-[var(--foreground)]/60">{label}</p>
    <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
