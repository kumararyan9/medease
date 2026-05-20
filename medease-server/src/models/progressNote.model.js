const mongoose = require('mongoose');

const progressNoteSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, required: true },
    type: { type: String, enum: ['SOAP', 'FREE_TEXT', 'STRUCTURED'], default: 'FREE_TEXT' },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

const ProgressNote = mongoose.models.ProgressNote || mongoose.model('ProgressNote', progressNoteSchema);

module.exports = ProgressNote;
