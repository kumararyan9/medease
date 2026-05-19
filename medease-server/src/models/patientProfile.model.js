import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    gender: { type: String, default: 'Not Selected' },
    dob: { type: String, default: 'Not Selected' },
    bloodGroup: { type: String, default: '' },
    height: { type: Number },
    weight: { type: Number },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    address: { type: Object, default: { line1: '', line2: '' } },
    preferredLanguage: { type: String, default: 'English' },
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

const PatientProfile =
  mongoose.models.PatientProfile || mongoose.model('PatientProfile', patientProfileSchema);

export default PatientProfile;
