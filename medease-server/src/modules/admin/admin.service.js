const bcrypt = require('bcrypt');
const userRepo = require('@/repositories/user.repository');
const storageService = require('@/services/storage');
const doctorProfileRepo = require('@/repositories/doctorProfile.repository');
const appointmentRepo = require('@/repositories/appointment.repository');
const Role = require('@/models/role.model');
const AppError = require('@/utils/AppError');
const { validateAddDoctorInput, validateCancelAppointment } = require('./admin.validator');

const roleIds = {};

async function getRoleId(slug) {
  if (!roleIds[slug]) {
    const role = await Role.findOne({ slug }).select('_id');
    if (role) roleIds[slug] = role._id;
  }
  return roleIds[slug];
}

async function addDoctor(data, imageFile) {
  validateAddDoctorInput(data, imageFile);

  const existingUser = await userRepo.findByEmail(data.email);
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const doctorRoleId = await getRoleId('doctor');
  if (!doctorRoleId) {
    throw new AppError('Doctor role not configured in database. Please seed roles first.', 500);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const imageUpload = await storageService.uploadFile(
    imageFile,
    storageService.FOLDER_CATEGORIES.DOCTOR_PROFILE
  );

  const user = await userRepo.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    roleId: doctorRoleId,
    image: imageUpload.url,
    profileImage: imageUpload,
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
  const patientRoleId = await getRoleId('patient');
  const doctorRoleId = await getRoleId('doctor');

  const [
    doctors,
    patients,
    totalAppointments,
    latestAppointments,
    revenueAgg,
    statusAgg,
    monthlyAgg,
  ] = await Promise.all([
    doctorProfileRepo.count(),
    patientRoleId ? userRepo.count({ roleId: patientRoleId }) : Promise.resolve(0),
    appointmentRepo.count(),
    appointmentRepo.findLatest(5),
    appointmentRepo.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $in: ['$paymentStatus', ['PAID', 'REFUNDED']] }, '$paymentAmount', 0] },
          },
          pendingRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING'] }, '$paymentAmount', 0] },
          },
          collectedRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, '$paymentAmount', 0] },
          },
        },
      },
    ]),
    appointmentRepo.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    appointmentRepo.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          appointments: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $in: ['$paymentStatus', ['PAID', 'REFUNDED']] }, '$paymentAmount', 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  const revenue = revenueAgg.length > 0 ? revenueAgg[0] : { totalRevenue: 0, pendingRevenue: 0, collectedRevenue: 0 };
  const statusCounts = {};
  for (const s of statusAgg) {
    statusCounts[s._id] = s.count;
  }

  const appointmentStatus = {
    PENDING: statusCounts.PENDING || 0,
    CONFIRMED: statusCounts.CONFIRMED || 0,
    COMPLETED: statusCounts.COMPLETED || 0,
    CANCELLED: statusCounts.CANCELLED || 0,
    NO_SHOW: statusCounts.NO_SHOW || 0,
  };

  const monthlyAnalytics = monthlyAgg.map((m) => ({
    year: m._id.year,
    month: m._id.month,
    appointments: m.appointments,
    revenue: m.revenue,
  }));

  return {
    doctors,
    patients,
    appointments: totalAppointments,
    revenue,
    appointmentStatus,
    monthlyAnalytics,
    latestAppointments,
  };
}

async function updateDoctor(doctorId, data, imageFile) {
  const user = await userRepo.findById(doctorId);
  if (!user) throw new AppError('Doctor not found.', 404);

  const profile = await doctorProfileRepo.findByUserId(doctorId);
  if (!profile) throw new AppError('Doctor profile not found.', 404);

  const userUpdate = {};
  if (data.name) userUpdate.name = data.name;
  if (data.email && data.email !== user.email) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) throw new AppError('A user with this email already exists.', 409);
    userUpdate.email = data.email;
  }
  if (data.phone) userUpdate.phone = data.phone;

  if (imageFile) {
    const oldPublicId = user.profileImage?.publicId;
    if (oldPublicId) {
      const result = await storageService.replaceFile(
        oldPublicId,
        imageFile,
        storageService.FOLDER_CATEGORIES.DOCTOR_PROFILE
      );
      userUpdate.image = result.url;
      userUpdate.profileImage = result;
    } else {
      const result = await storageService.uploadFile(
        imageFile,
        storageService.FOLDER_CATEGORIES.DOCTOR_PROFILE
      );
      userUpdate.image = result.url;
      userUpdate.profileImage = result;
    }
  }

  if (Object.keys(userUpdate).length > 0) {
    await userRepo.update(doctorId, userUpdate);
  }

  if (data.specialityId) profile.specialityId = data.specialityId;
  if (data.degree) profile.degree = data.degree;
  if (data.experienceYears !== undefined) profile.experienceYears = Number(data.experienceYears);
  if (data.about !== undefined) profile.about = data.about;
  if (data.consultationFee !== undefined) profile.consultationFee = Number(data.consultationFee);
  if (data.address)
    profile.address = typeof data.address === 'string' ? JSON.parse(data.address) : data.address;
  if (data.available !== undefined) {
    profile.available = data.available === true || data.available === 'true';
  }
  if (data.languages)
    profile.languages = typeof data.languages === 'string' ? JSON.parse(data.languages) : data.languages;
  if (data.licenseNumber !== undefined) profile.licenseNumber = data.licenseNumber;
  if (data.hospitalAffiliation !== undefined) profile.hospitalAffiliation = data.hospitalAffiliation;

  await profile.save();

  return { message: 'Doctor updated successfully' };
}

async function removeDoctor(doctorId) {
  const user = await userRepo.findById(doctorId);
  if (!user) throw new AppError('Doctor not found.', 404);

  const profile = await doctorProfileRepo.findByUserId(doctorId);

  if (profile) {
    if (user.profileImage?.publicId) {
      await storageService.deleteFile(user.profileImage.publicId).catch(() => {});
    }
    await doctorProfileRepo.delete(profile._id);
  }

  await userRepo.delete(doctorId);

  return { message: 'Doctor removed successfully' };
}

module.exports = {
  addDoctor,
  getAllDoctors,
  changeAvailability,
  getAllAppointments,
  cancelAppointment,
  getDashboard,
  updateDoctor,
  removeDoctor,
};
