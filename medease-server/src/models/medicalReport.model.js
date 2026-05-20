const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportType: { type: String, default: '' },
    description: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

const MedicalReport = mongoose.models.MedicalReport || mongoose.model('MedicalReport', medicalReportSchema);

module.exports = MedicalReport;
