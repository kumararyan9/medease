import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import UploadZone from "../../components/UploadZone";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [experienceYears, setExperienceYears] = useState("");
  const [fees, setFees] = useState("");
  const [specialityId, setSpecialityId] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  useEffect(() => {
    axios
      .get(backendUrl + "/api/specialities")
      .then(({ data }) => {
        if (data.success) setSpecialities(data.specialities || []);
      })
      .catch(() => {});
  }, [backendUrl]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.error("Please upload a doctor image.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experienceYears", Number(experienceYears));
      formData.append("consultationFee", Number(fees));
      formData.append("about", about);
      formData.append("specialityId", specialityId);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperienceYears("");
        setFees("");
        setSpecialityId("");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      }
    } catch (err) {
      if (err.response?.data?.message?.includes("E11000 duplicate key error")) {
        toast.error(`A doctor with this email: "${email}" already exists!`);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmitHandler}
      className="m-5 w-full"
    >
      <p className="mb-3 text-lg font-medium text-[var(--foreground)]">Add Doctor</p>
      <div className="bg-[var(--card-bg)] px-4 sm:px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-auto border-[var(--border)]">
        <UploadZone
          value={docImg}
          onChange={setDocImg}
          label="Doctor Photo"
          error={!docImg && false}
        />

        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-10 mt-6 text-[var(--foreground)]">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <InputField label="Doctor name" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full name"
                required
              />
            </InputField>
            <InputField label="Doctor email" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email address"
                required
              />
            </InputField>
            <InputField label="Doctor password" required>
              <div className="relative">
                <input
                  className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)] pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </InputField>
            <InputField label="Experience (years)" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setExperienceYears(e.target.value)}
                value={experienceYears}
                type="number"
                min="0"
                placeholder="Years of experience"
                required
              />
            </InputField>
            <InputField label="Consultation Fee" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                min="0"
                placeholder="Fee amount"
                required
              />
            </InputField>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <InputField label="Speciality" required>
              <select
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setSpecialityId(e.target.value)}
                value={specialityId}
                required
              >
                <option value="">Select speciality</option>
                {specialities.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </InputField>
            <InputField label="Education" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="MBBS, MD"
                required
              />
            </InputField>
            <InputField label="Address" required>
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)] mb-2"
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address line 1"
                required
              />
              <input
                className="w-full border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address line 2"
              />
            </InputField>
          </div>
        </div>
        <div className="mt-6">
          <InputField label="About doctor" required>
            <textarea
              className="w-full border rounded px-4 py-2 border-[var(--border)] bg-[var(--background)] resize-none"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              placeholder="Write about the doctor"
              rows={4}
              required
            />
          </InputField>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="bg-[var(--primary)] text-white px-10 py-3 mt-6 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? "Adding..." : "Add Doctor"}
        </motion.button>
      </div>
    </motion.form>
  );
};

const InputField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-[var(--foreground)]/60">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

export default AddDoctor;
