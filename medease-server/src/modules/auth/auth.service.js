const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('@/repositories/user.repository');
const storageService = require('@/services/storage');
const patientProfileRepo = require('@/repositories/patientProfile.repository');
const doctorProfileRepo = require('@/repositories/doctorProfile.repository');
const Role = require('@/models/role.model');
const env = require('@/config/env');
const AppError = require('@/utils/AppError');
const { validateRegisterInput, validateLoginInput, validateProfileUpdateInput } = require('./auth.validator');

const roleIds = {};

async function getRoleId(slug) {
  if (!roleIds[slug]) {
    const role = await Role.findOne({ slug }).select('_id');
    if (role) roleIds[slug] = role._id;
  }
  return roleIds[slug];
}

function signToken(id, role) {
  return jwt.sign({ id, role }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

async function registerUser({ name, email, password }) {
  validateRegisterInput({ name, email, password });

  const patientRoleId = await getRoleId('patient');
  if (!patientRoleId) throw new AppError('Patient role not configured.', 500);

  const userCount = await userRepo.count({ roleId: patientRoleId });
  if (userCount >= env.app.maxUsers) {
    throw new AppError(`User limit of ${env.app.maxUsers} reached.`, 403);
  }

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new AppError('This email address is already in use.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepo.create({
    name,
    email,
    password: hashedPassword,
    roleId: patientRoleId,
  });

  user.setRoleName('PATIENT');
  await patientProfileRepo.create({ userId: user._id });

  const token = signToken(user._id, 'PATIENT');
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

async function loginUser(email, password) {
  validateLoginInput({ email, password });

  const user = await userRepo.findByEmailWithPassword(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }
  user.setRoleName(user.roleId?.name);
  if (user.role !== 'PATIENT') {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }
  if (!user.isActive) {
    throw new AppError('Account is deactivated.', 403);
  }

  await userRepo.updateLastLogin(user._id);
  const token = signToken(user._id, 'PATIENT');
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
}

async function loginDoctor(email, password) {
  validateLoginInput({ email, password });

  const user = await userRepo.findByEmailWithPassword(email);
  user?.setRoleName(user.roleId?.name);
  if (!user || user.role !== 'DOCTOR') {
    throw new AppError('Invalid email.', 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Password is incorrect.', 401);
  }
  if (!user.isActive) {
    throw new AppError('Account is deactivated.', 403);
  }

  await userRepo.updateLastLogin(user._id);
  const token = signToken(user._id, 'DOCTOR');
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

async function loginAdmin(email, password) {
  validateLoginInput({ email, password });

  if (email === env.admin.email && password === env.admin.password) {
    const token = signToken('admin', 'ADMIN');
    return { token, user: { id: 'admin', name: 'Admin', email: env.admin.email, role: 'ADMIN' } };
  }

  const user = await userRepo.findByEmailWithPassword(email);
  user?.setRoleName(user.roleId?.name);
  if (user && user.role === 'ADMIN') {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      await userRepo.updateLastLogin(user._id);
      const token = signToken(user._id, 'ADMIN');
      return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    }
  }

  throw new AppError('Invalid email or password.', 400);
}

async function getUserProfile(userId, role) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  await user.populate('roleId', 'name slug');
  user.setRoleName(user.roleId?.name);

  const profile = { ...user.toJSON() };

  if (role === 'DOCTOR') {
    const doctorProfile = await doctorProfileRepo.findByUserIdPopulated(userId);
    if (doctorProfile) {
      Object.assign(profile, {
        specialityId: doctorProfile.specialityId,
        degree: doctorProfile.degree,
        experienceYears: doctorProfile.experienceYears,
        about: doctorProfile.about,
        consultationFee: doctorProfile.consultationFee,
        address: doctorProfile.address,
        available: doctorProfile.available,
        languages: doctorProfile.languages,
        ratingAverage: doctorProfile.ratingAverage,
        totalPatients: doctorProfile.totalPatients,
        licenseNumber: doctorProfile.licenseNumber,
        hospitalAffiliation: doctorProfile.hospitalAffiliation,
        onlineConsultationEnabled: doctorProfile.onlineConsultationEnabled,
        docId: userId,
      });
    }
  } else if (role === 'PATIENT') {
    const patientProfile = await patientProfileRepo.findByUserId(userId);
    if (patientProfile) {
      Object.assign(profile, {
        gender: patientProfile.gender,
        dob: patientProfile.dob,
        address: patientProfile.address,
        bloodGroup: patientProfile.bloodGroup,
        allergies: patientProfile.allergies,
        emergencyContact: patientProfile.emergencyContact,
      });
    }
  }

  return profile;
}

async function updateUserProfile(userId, { name, phone, address, dob, gender }, file) {
  validateProfileUpdateInput({ name, phone });

  const user = await userRepo.findById(userId);

  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;

  if (file) {
    const oldPublicId = user?.profileImage?.publicId;
    if (oldPublicId) {
      const result = await storageService.replaceFile(
        oldPublicId,
        file,
        storageService.FOLDER_CATEGORIES.PATIENT_PROFILE
      );
      updateData.image = result.url;
      updateData.profileImage = result;
    } else {
      const result = await storageService.uploadFile(
        file,
        storageService.FOLDER_CATEGORIES.PATIENT_PROFILE
      );
      updateData.image = result.url;
      updateData.profileImage = result;
    }
  }

  if (Object.keys(updateData).length > 0) {
    await userRepo.update(userId, updateData);
  }

  if (address !== undefined || dob !== undefined || gender !== undefined) {
    const profileUpdate = {};
    if (address !== undefined)
      profileUpdate.address = typeof address === 'string' ? JSON.parse(address) : address;
    if (dob !== undefined) profileUpdate.dob = dob;
    if (gender !== undefined) profileUpdate.gender = gender;

    await patientProfileRepo.upsert(userId, profileUpdate);
  }

  return getUserProfile(userId, 'PATIENT');
}

module.exports = { registerUser, loginUser, loginDoctor, loginAdmin, getUserProfile, updateUserProfile };
