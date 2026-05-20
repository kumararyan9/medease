const AppError = require('@/utils/AppError');
const cloudinaryStorage = require('./cloudinary.storage');
const { FOLDER_CATEGORIES, getFolderMap } = require('./storage.constants');

const FOLDER_MAP = getFolderMap();

function generateFolderPath(category) {
  const subFolder = FOLDER_MAP[category];
  if (!subFolder) {
    throw new AppError(`Unknown storage category: ${category}`, 500);
  }
  const env = require('@/config/env');
  return `${env.storage.mediaRoot}/${subFolder}`;
}

function extractPublicId(url) {
  if (!url) return '';
  try {
    const parts = url.split('/');
    const versionIndex = parts.findIndex((p) => p.startsWith('v') && !isNaN(Number(p.slice(1))));
    if (versionIndex === -1) return '';
    const filePart = parts.slice(versionIndex + 1).join('/');
    return filePart.replace(/\.[^/.]+$/, '');
  } catch {
    return '';
  }
}

function formatResult(cloudinaryResult, folderPath) {
  return {
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
    folder: folderPath,
    provider: 'cloudinary',
    resourceType: 'image',
  };
}

async function uploadFile(file, category) {
  const folderPath = generateFolderPath(category);
  const result = await cloudinaryStorage.uploadBuffer(file.buffer, {
    folder: folderPath,
    resourceType: 'image',
  });
  return formatResult(result, folderPath);
}

async function replaceFile(oldPublicId, file, category) {
  const newFile = await uploadFile(file, category);

  if (oldPublicId) {
    await cloudinaryStorage.destroy(oldPublicId).catch((err) => {
      console.warn('Failed to delete old file from Cloudinary:', err.message);
    });
  }

  return newFile;
}

async function deleteFile(publicId) {
  if (!publicId) return;
  await cloudinaryStorage.destroy(publicId);
}

module.exports = {
  FOLDER_CATEGORIES,
  uploadFile,
  replaceFile,
  deleteFile,
  generateFolderPath,
  extractPublicId,
};
