import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speciality',
      required: true,
    },
    degree: { type: String, required: true, trim: true },
    experienceYears: { type: Number, required: true, min: 0 },
    about: { type: String, required: true, trim: true },
    consultationFee: { type: Number, required: true, min: 0 },
    languages: [{ type: String, trim: true }],
    address: { type: Object, required: true },
    available: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    licenseNumber: { type: String, default: '' },
    hospitalAffiliation: { type: String, default: '' },
    onlineConsultationEnabled: { type: Boolean, default: true },
    profileCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

doctorProfileSchema.index({ specialityId: 1, available: 1 });

const DoctorProfile =
  mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;
