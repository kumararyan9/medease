import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import UploadZone from "./UploadZone";

const DoctorEditDrawer = ({ doctor, onClose, onSave, specialities }) => {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialityId: doctor.speciality?._id || "",
        degree: doctor.degree || "",
        experienceYears: doctor.experienceYears || "",
        about: doctor.about || "",
        consultationFee: doctor.fees || "",
        address: doctor.address || { line1: "", line2: "" },
        available: doctor.available ?? true,
        licenseNumber: doctor.licenseNumber || "",
        hospitalAffiliation: doctor.hospitalAffiliation || "",
      });
      setImage(null);
      setErrors({});
    }
  }, [doctor]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleAddressChange = useCallback((line, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [line]: value },
    }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (form.experienceYears && (isNaN(form.experienceYears) || form.experienceYears < 0))
      errs.experienceYears = "Invalid value";
    if (form.consultationFee && (isNaN(form.consultationFee) || form.consultationFee < 0))
      errs.consultationFee = "Invalid value";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone || "");
      formData.append("degree", form.degree || "");
      formData.append("experienceYears", form.experienceYears || "0");
      formData.append("about", form.about || "");
      formData.append("consultationFee", form.consultationFee || "0");
      if (form.specialityId) formData.append("specialityId", form.specialityId);
      formData.append("address", JSON.stringify(form.address));
      formData.append("available", form.available);
      if (form.licenseNumber) formData.append("licenseNumber", form.licenseNumber);
      if (form.hospitalAffiliation)
        formData.append("hospitalAffiliation", form.hospitalAffiliation);

      await onSave(doctor._id, formData);
      toast.success("Doctor updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {doctor && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[var(--card-bg)] border-l border-[var(--border)] z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Edit Doctor</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[var(--muted-bg)] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <UploadZone
                value={image}
                onChange={setImage}
                label="Doctor Photo"
                existingImage={doctor?.image}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" error={errors.name}>
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    value={form.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full name"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Email address"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    value={form.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Phone number"
                  />
                </Field>
                <Field label="Speciality">
                  <select
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    value={form.specialityId || ""}
                    onChange={(e) => handleChange("specialityId", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {specialities.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Degree">
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    value={form.degree || ""}
                    onChange={(e) => handleChange("degree", e.target.value)}
                    placeholder="MBBS, MD"
                  />
                </Field>
                <Field label="Experience (years)" error={errors.experienceYears}>
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    type="number"
                    min="0"
                    value={form.experienceYears || ""}
                    onChange={(e) => handleChange("experienceYears", e.target.value)}
                    placeholder="Years"
                  />
                </Field>
                <Field label="Consultation Fee" error={errors.consultationFee}>
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    type="number"
                    min="0"
                    value={form.consultationFee || ""}
                    onChange={(e) => handleChange("consultationFee", e.target.value)}
                    placeholder="Fee"
                  />
                </Field>
                <Field label="License Number">
                  <input
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                    value={form.licenseNumber || ""}
                    onChange={(e) => handleChange("licenseNumber", e.target.value)}
                    placeholder="License #"
                  />
                </Field>
              </div>

              <Field label="Hospital Affiliation">
                <input
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                  value={form.hospitalAffiliation || ""}
                  onChange={(e) => handleChange("hospitalAffiliation", e.target.value)}
                  placeholder="Hospital name"
                />
              </Field>

              <Field label="Address">
                <input
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 mb-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                  value={form.address?.line1 || ""}
                  onChange={(e) => handleAddressChange("line1", e.target.value)}
                  placeholder="Line 1"
                />
                <input
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                  value={form.address?.line2 || ""}
                  onChange={(e) => handleAddressChange("line2", e.target.value)}
                  placeholder="Line 2"
                />
              </Field>

              <Field label="About">
                <textarea
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all min-h-[80px] resize-none"
                  rows={3}
                  value={form.about || ""}
                  onChange={(e) => handleChange("about", e.target.value)}
                  placeholder="About the doctor"
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.available ?? true}
                    onChange={(e) => handleChange("available", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-[var(--primary)] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                </div>
                <span className="text-sm text-[var(--foreground)]">Available for appointments</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors cursor-pointer text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors cursor-pointer text-sm font-medium flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-[var(--foreground)]/60">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default DoctorEditDrawer;
