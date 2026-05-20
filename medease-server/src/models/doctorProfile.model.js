const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Speciality' },
    degree: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    about: { type: String, default: '' },
    consultationFee: { type: Number, default: 0 },
    address: { type: mongoose.Schema.Types.Mixed, default: {} },
    available: { type: Boolean, default: true },
    languages: { type: [String], default: [] },
    ratingAverage: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    licenseNumber: { type: String, default: '' },
    hospitalAffiliation: { type: String, default: '' },
    onlineConsultationEnabled: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    totalAppointments: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);

module.exports = DoctorProfile;
