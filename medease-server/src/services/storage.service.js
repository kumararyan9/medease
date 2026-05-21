import { v2 as cloudinary } from 'cloudinary';

function extractPublicId(imageUrl) {
  if (!imageUrl || !imageUrl.includes('cloudinary')) return null;
  const parts = imageUrl.split('/');
  const fileWithExt = parts[parts.length - 1];
  const publicId = fileWithExt.replace(/\.[^.]+$/, '');
  const folder = parts[parts.length - 2];
  if (folder && !folder.includes('.')) return `${folder}/${publicId}`;
  return publicId;
}

async function uploadImage(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
  });
  return result.secure_url;
}

async function deleteImage(imageUrl) {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId).catch(() => {});
}

async function replaceImage(filePath, oldImageUrl) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
  });
  if (oldImageUrl) {
    await deleteImage(oldImageUrl);
  }
  return result.secure_url;
}

export { uploadImage, deleteImage, replaceImage };
