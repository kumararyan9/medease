const userRepo = require('@/repositories/user.repository');
const patientProfileRepo = require('@/repositories/patientProfile.repository');
const appointmentRepo = require('@/repositories/appointment.repository');
const doctorProfileRepo = require('@/repositories/doctorProfile.repository');
const AppError = require('@/utils/AppError');
const { validateProfileUpdate } = require('./patient.validator');

async function getProfile(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  const profile = await patientProfileRepo.findByUserId(userId);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    phone: user.phone,
    gender: profile?.gender || 'Not Selected',
    dob: profile?.dob || 'Not Selected',
    address: profile?.address || { line1: '', line2: '' },
    bloodGroup: profile?.bloodGroup || '',
    allergies: profile?.allergies || [],
    emergencyContact: profile?.emergencyContact || { name: '', phone: '', relation: '' },
  };
}

async function updateProfile(userId, data) {
  validateProfileUpdate(data);
  const { name, phone, address, dob, gender, bloodGroup, allergies, emergencyContact } = data;

  const userUpdate = {};
  if (name) userUpdate.name = name;
  if (phone) userUpdate.phone = phone;
  if (Object.keys(userUpdate).length > 0) {
    await userRepo.update(userId, userUpdate);
  }

  const profileUpdate = {};
  if (address !== undefined)
    profileUpdate.address = typeof address === 'string' ? JSON.parse(address) : address;
  if (dob !== undefined) profileUpdate.dob = dob;
  if (gender !== undefined) profileUpdate.gender = gender;
  if (bloodGroup !== undefined) profileUpdate.bloodGroup = bloodGroup;
  if (allergies !== undefined)
    profileUpdate.allergies = typeof allergies === 'string' ? JSON.parse(allergies) : allergies;
  if (emergencyContact !== undefined)
    profileUpdate.emergencyContact =
      typeof emergencyContact === 'string' ? JSON.parse(emergencyContact) : emergencyContact;

  if (Object.keys(profileUpdate).length > 0) {
    await patientProfileRepo.upsert(userId, profileUpdate);
  }

  return getProfile(userId);
}

async function getAppointments(userId) {
  const appointments = await appointmentRepo.findPatientAppointments(userId);

  const doctorIds = [...new Set(appointments.map((a) => a.doctorId?._id).filter(Boolean))];
  const profiles = await doctorProfileRepo.find({ userId: { $in: doctorIds } });
  const profileMap = {};
  for (const p of profiles) {
    profileMap[p.userId.toString()] = p;
  }

  return appointments.map((apt) => {
    const docUser = apt.doctorId || {};
    const profile = profileMap[docUser._id?.toString()] || {};
    const slotDate = new Date(apt.slotStart);
    const dd = String(slotDate.getDate()).padStart(2, '0');
    const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
    const yyyy = slotDate.getFullYear();
    const hours = slotDate.getHours();
    const minutes = String(slotDate.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    const timeStr = `${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;

    return {
      _id: apt._id,
      docData: {
        image: docUser.image || '',
        name: docUser.name || '',
        speciality: profile.specialityId || '',
        address: profile.address || { line1: '', line2: '' },
        consultationFee: profile.consultationFee || 0,
        fees: profile.consultationFee || 0,
      },
      slotDate: `${dd}_${mm}_${yyyy}`,
      slotTime: timeStr,
      amount: apt.paymentAmount || 0,
      payment: apt.paymentStatus === 'PAID',
      cancelled: apt.status === 'CANCELLED',
      isCompleted: apt.status === 'COMPLETED',
    };
  });
}

module.exports = { getProfile, updateProfile, getAppointments };
