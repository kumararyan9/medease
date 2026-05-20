const { v2: cloudinary } = require('@/config/cloudinary');

async function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || '',
        resource_type: options.resourceType || 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

async function destroy(publicId, options = {}) {
  return cloudinary.uploader.destroy(publicId, options);
}

module.exports = { uploadBuffer, destroy };
