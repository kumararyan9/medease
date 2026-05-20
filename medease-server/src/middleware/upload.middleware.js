const multer = require('multer');
const AppError = require('@/utils/AppError');
const env = require('@/config/env');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (env.storage.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed: ${env.storage.allowedImageTypes.join(', ')}`,
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.storage.maxFileSize },
});

module.exports = upload;
