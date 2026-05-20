require('dotenv/config');

const env = {
  port: parseInt(process.env.PORT, 10) || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME || 'medease',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  dnsServers: process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map((s) => s.trim())
    : null,

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'cloudinary',
    mediaRoot: process.env.MEDIA_ROOT || 'medease',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES
      ? process.env.ALLOWED_IMAGE_TYPES.split(',').map((s) => s.trim())
      : ['image/jpeg', 'image/png', 'image/webp'],
    folders: {
      doctorProfile: process.env.DOCTOR_PROFILE_FOLDER || 'doctors/profile',
      patientProfile: process.env.PATIENT_PROFILE_FOLDER || 'patients/profile',
      clinicLogo: process.env.CLINIC_LOGO_FOLDER || 'clinics/logo',
      reports: process.env.REPORTS_FOLDER || 'reports',
    },
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
      : '*',
  },

  app: {
    maxUsers: parseInt(process.env.MAX_USERS, 10) || 100,
    slotInterval: parseInt(process.env.SLOT_INTERVAL, 10) || 30,
    workingHoursStart: parseInt(process.env.WORKING_HOURS_START, 10) || 10,
    workingHoursEnd: parseInt(process.env.WORKING_HOURS_END, 10) || 16,
  },
};

module.exports = env;
