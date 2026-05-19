import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    reportType: {
      type: String,
      enum: ['XRAY', 'MRI', 'BLOOD_TEST', 'PRESCRIPTION', 'SCAN', 'OTHER'],
      default: 'OTHER',
    },
    fileUrl: { type: String, required: true },
    title: { type: String, required: true },
    notes: { type: String, default: '' },
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

medicalReportSchema.index({ patientId: 1 });
medicalReportSchema.index({ appointmentId: 1 });

const MedicalReport =
  mongoose.models.MedicalReport || mongoose.model('MedicalReport', medicalReportSchema);

export default MedicalReport;
