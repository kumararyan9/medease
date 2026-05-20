const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    image: { type: String, default: '' },
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      folder: { type: String, default: '' },
      provider: { type: String, default: 'cloudinary' },
      resourceType: { type: String, default: 'image' },
    },
    phone: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.virtual('role').get(function () {
  return this._roleName;
});

userSchema.methods.setRoleName = function (name) {
  this._roleName = name;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
