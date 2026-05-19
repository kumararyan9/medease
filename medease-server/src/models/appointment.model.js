import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
    },
    appointmentType: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'ONLINE',
    },
    symptoms: { type: String, default: '' },
    notes: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
    cancelledBy: { type: String, enum: ['PATIENT', 'DOCTOR', 'ADMIN'] },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    paymentAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
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

appointmentSchema.index({ doctorId: 1, slotStart: 1 }, { unique: true });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ slotStart: 1 });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
