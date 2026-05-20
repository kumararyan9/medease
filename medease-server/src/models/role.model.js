const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, enum: ['PATIENT', 'DOCTOR', 'ADMIN'] },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    permissions: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

module.exports = Role;
