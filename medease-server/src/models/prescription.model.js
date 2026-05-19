import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, default: '' },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicines: [medicineSchema],
    advice: { type: String, default: '' },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
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

prescriptionSchema.index({ appointmentId: 1 });
prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });

const Prescription =
  mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
