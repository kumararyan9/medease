import mongoose from 'mongoose';

const progressNoteSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    note: { type: String, required: true },
    progressStatus: { type: String, default: '' },
    nextSteps: { type: String, default: '' },
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

progressNoteSchema.index({ patientId: 1 });
progressNoteSchema.index({ doctorId: 1 });
progressNoteSchema.index({ appointmentId: 1 });

const ProgressNote =
  mongoose.models.ProgressNote || mongoose.model('ProgressNote', progressNoteSchema);

export default ProgressNote;
