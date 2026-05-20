const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    gender: { type: String, default: '' },
    dob: { type: String, default: '' },
    address: { type: mongoose.Schema.Types.Mixed, default: {} },
    bloodGroup: { type: String, default: '' },
    allergies: { type: [String], default: [] },
    emergencyContact: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

const PatientProfile = mongoose.models.PatientProfile || mongoose.model('PatientProfile', patientProfileSchema);

module.exports = PatientProfile;
