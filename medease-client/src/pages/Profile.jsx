import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Avatar from "../components/Avatar";
import ConfirmModal from "../components/ConfirmModal";

const Profile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const inputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleRemoveImage = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setShowRemoveConfirm(false);
  };

  const updateUserProfileData = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) {
        formData.append("image", image);
      } else if (preview === null && userData.image) {
        formData.append("removeImage", "true");
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center sm:text-left mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          My Profile
        </h1>
        <p className="text-sm text-[var(--foreground)]/60 mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <Avatar
                src={preview || (image ? null : userData.image)}
                name={userData.name}
                size="2xl"
                className="ring-4 ring-[var(--card-bg)] shadow-md"
              />
              {isEdit && (
                <div className="absolute -bottom-1 -right-1 flex gap-1">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-md hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                    title="Change photo"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) handleImageSelect(e.target.files[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  {(preview || userData.image) && (
                    <button
                      onClick={handleRemoveImage}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              {isEdit ? (
                <input
                  className="text-xl font-bold text-[var(--foreground)] bg-[var(--muted-bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {userData.name}
                </h2>
              )}
              <p className="text-sm text-[var(--foreground)]/60 mt-1">
                {userData.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--muted-bg)] rounded-lg p-4">
                <p className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-[var(--primary)] break-all">
                  {userData.email}
                </p>
              </div>
              <div className="bg-[var(--muted-bg)] rounded-lg p-4">
                <p className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-1">
                  Phone
                </p>
                {isEdit ? (
                  <input
                    className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] focus:outline-none"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {userData.phone || "Not provided"}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 bg-[var(--muted-bg)] rounded-lg p-4">
                <p className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-1">
                  Address
                </p>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                      value={userData.address.line1}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      placeholder="Address line 1"
                    />
                    <input
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                      value={userData.address.line2}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      placeholder="Address line 2"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-[var(--foreground)]">
                    {userData.address.line1 || "Not provided"}
                    {userData.address.line1 && userData.address.line2 ? ", " : ""}
                    {userData.address.line2}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
                Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--muted-bg)] rounded-lg p-4">
                <p className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-1">
                  Gender
                </p>
                {isEdit ? (
                  <select
                    className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] focus:outline-none cursor-pointer"
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, gender: e.target.value }))
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {userData.gender || "Not selected"}
                  </p>
                )}
              </div>
              <div className="bg-[var(--muted-bg)] rounded-lg p-4">
                <p className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-1">
                  Date of Birth
                </p>
                {isEdit ? (
                  <input
                    className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] focus:outline-none"
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {userData.dob && userData.dob !== "Not Selected"
                      ? new Date(userData.dob).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 sm:px-8 py-4 border-t border-[var(--border)] bg-[var(--muted-bg)]/30 flex justify-end gap-3">
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setImage(null);
                  setPreview(null);
                  loadUserProfileData();
                }}
                className="px-5 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                onClick={updateUserProfileData}
                className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
            >
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      {showRemoveConfirm && (
        <ConfirmModal
          title="Remove photo"
          message="Are you sure you want to remove your profile photo?"
          confirmText="Remove"
          cancelText="Keep it"
          onConfirm={confirmRemoveImage}
          onCancel={() => setShowRemoveConfirm(false)}
        />
      )}
    </motion.div>
  );
};

export default Profile;
