import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import userRepo from '@/repositories/user.repository.js';
import doctorProfileRepo from '@/repositories/doctorProfile.repository.js';
import appointmentRepo from '@/repositories/appointment.repository.js';
import AppError from '@/utils/AppError.js';
import { validateAddDoctorInput, validateCancelAppointment } from './admin.validator.js';

async function addDoctor(data, imageFile) {
  validateAddDoctorInput(data, imageFile);

  const existingUser = await userRepo.findByEmail(data.email);
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    resource_type: 'image',
  });

  const user = await userRepo.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'DOCTOR',
    image: imageUpload.secure_url,
  });

  await doctorProfileRepo.create({
    userId: user._id,
    specialityId: data.specialityId,
    degree: data.degree,
    experienceYears: Number(data.experienceYears),
    about: data.about,
    consultationFee: Number(data.consultationFee),
    address: typeof data.address === 'string' ? JSON.parse(data.address) : data.address,
    languages: data.languages
      ? typeof data.languages === 'string'
        ? JSON.parse(data.languages)
        : data.languages
      : [],
    licenseNumber: data.licenseNumber || '',
    hospitalAffiliation: data.hospitalAffiliation || '',
    onlineConsultationEnabled: data.onlineConsultationEnabled !== 'false',
    profileCompleted: true,
  });

  return { message: 'Doctor added successfully' };
}

async function getAllDoctors() {
  const profiles = await doctorProfileRepo.findPopulated();
  return profiles.map((profile) => ({
    _id: profile.userId?._id,
    name: profile.userId?.name,
    email: profile.userId?.email,
    image: profile.userId?.image,
    phone: profile.userId?.phone,
    speciality: profile.specialityId,
    degree: profile.degree,
    experienceYears: profile.experienceYears,
    about: profile.about,
    consultationFee: profile.consultationFee,
    address: profile.address,
    available: profile.available,
    languages: profile.languages,
    ratingAverage: profile.ratingAverage,
    createdAt: profile.createdAt,
  }));
}

async function changeAvailability(doctorId) {
  const profile = await doctorProfileRepo.findByUserId(doctorId);
  if (!profile) {
    throw new AppError('Doctor not found.', 404);
  }
  profile.available = !profile.available;
  await profile.save();
  return { message: 'Doctor availability status changed successfully' };
}

async function getAllAppointments() {
  return appointmentRepo.findPopulated();
}

async function cancelAppointment(appointmentId) {
  validateCancelAppointment({ appointmentId });

  const appointment = await appointmentRepo.findById(appointmentId);
  if (!appointment) {
    throw new AppError('Appointment not found.', 404);
  }
  if (appointment.status === 'CANCELLED') {
    throw new AppError('Appointment is already cancelled.', 400);
  }

  appointment.status = 'CANCELLED';
  appointment.cancelledBy = 'ADMIN';
  await appointment.save();

  return { message: 'Appointment cancelled.' };
}

async function getDashboard() {
  const [doctors, patients, appointments, latestAppointments] = await Promise.all([
    doctorProfileRepo.count(),
    userRepo.count({ role: 'PATIENT' }),
    appointmentRepo.count(),
    appointmentRepo.findLatest(5),
  ]);

  return { doctors, patients, appointments, latestAppointments };
}

export {
  addDoctor,
  getAllDoctors,
  changeAvailability,
  getAllAppointments,
  cancelAppointment,
  getDashboard,
};
