import { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
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

  const { backendUrl, aToken } = useContext(AdminContext);

  useEffect(() => {
    axios
      .get(backendUrl + "/api/specialities")
      .then(({ data }) => {
        if (data.success) setSpecialities(data.specialities || []);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Please upload a doctor image.");
      }
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
        setDocImg(false);
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
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-[var(--card-bg)] px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll border-[var(--border)]">
        <div className="flex items-center gap-4 mb-8 text-[var(--foreground)]">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-[var(--muted-bg)] rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Upload Doctor picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-[var(--foreground)]">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor email</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 relative">
              <p>Doctor password</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)] pr-10"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[34px] text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience (years)</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setExperienceYears(e.target.value)}
                value={experienceYears}
                type="number"
                min="0"
                placeholder="Years of experience"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Fee</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="Fee"
                required
              />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
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
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)] mb-2"
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address line 1"
                required
              />
              <input
                className="border rounded px-3 py-2 border-[var(--border)] bg-[var(--background)]"
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address line 2"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2 text-[var(--foreground)]">About doctor</p>
          <textarea
            className="w-full border rounded px-4 pt-2 border-[var(--border)] bg-[var(--background)]"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder="Write about doctor"
            rows={5}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-[var(--primary)] text-white px-10 py-3 mt-4 rounded-full cursor-pointer"
        >
          Add doctor
        </motion.button>
      </div>
    </motion.form>
  );
};

export default AddDoctor;
