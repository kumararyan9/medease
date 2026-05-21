import { useContext, useState, useEffect, useCallback } from "react";
import { AdminContext } from "../../context/AdminContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import Avatar from "../../components/Avatar";
import ConfirmModal from "../../components/ConfirmModal";

const ROLES = [
  { label: "All roles", value: "" },
  { label: "Patient", value: "patient" },
  { label: "Doctor", value: "doctor" },
  { label: "Admin", value: "admin" },
];

const STATUS_OPTIONS = [
  { label: "All status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const UsersList = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (search.trim()) params.search = search.trim();
        if (role) params.role = role;
        const { data } = await axios.get(backendUrl + "/api/admin/users", {
          params,
          headers: { aToken },
        });
        if (data.success) {
          setUsers(data.users || []);
          setPagination(data.pagination || { page: 1, total: 0, totalPages: 0 });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, aToken, search, role]
  );

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchUsers(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="m-4 sm:m-5 w-full"
    >
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-[var(--foreground)]">All Users</h1>
        <span className="text-xs text-[var(--foreground)]/50 bg-[var(--muted-bg)] px-3 py-1 rounded-full">
          {pagination.total} user{pagination.total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--border)]">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-[var(--foreground)]/40 text-sm">
            No users found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted-bg)]/30">
                    <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider hidden md:table-cell">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-[var(--foreground)]/60 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-[var(--muted-bg)]/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.image} name={user.name} size="md" />
                          <span className="font-medium text-[var(--foreground)] truncate max-w-[160px]">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--foreground)]/70 hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            user.role === "DOCTOR"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : user.role === "PATIENT"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs ${
                            user.isActive ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500" : "bg-red-400"
                            }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--foreground)]/50 text-xs hidden md:table-cell">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setConfirm(user)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm text-[var(--foreground)]/60">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={!!confirm}
        onConfirm={async () => {
          // Remove user function - placeholder for now
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
        title="Remove user"
        message={`Are you sure you want to remove ${confirm?.name}? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
      />
    </motion.div>
  );
};

export default UsersList;
