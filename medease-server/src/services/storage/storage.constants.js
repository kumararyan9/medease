const env = require('@/config/env');

const FOLDER_CATEGORIES = {
  DOCTOR_PROFILE: 'DOCTOR_PROFILE',
  PATIENT_PROFILE: 'PATIENT_PROFILE',
  CLINIC_LOGO: 'CLINIC_LOGO',
  REPORTS: 'REPORTS',
};

function getFolderMap() {
  return {
    [FOLDER_CATEGORIES.DOCTOR_PROFILE]: env.storage.folders.doctorProfile,
    [FOLDER_CATEGORIES.PATIENT_PROFILE]: env.storage.folders.patientProfile,
    [FOLDER_CATEGORIES.CLINIC_LOGO]: env.storage.folders.clinicLogo,
    [FOLDER_CATEGORIES.REPORTS]: env.storage.folders.reports,
  };
}

module.exports = { FOLDER_CATEGORIES, getFolderMap };
