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

export async function up(db) {
  const users = db.collection('users');
  const cursor = users.find({ image: { $exists: true, $ne: '' } });

  let migrated = 0;
  while (await cursor.hasNext()) {
    const user = await cursor.next();
    if (!user.image) continue;

    const publicId = extractPublicId(user.image);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          profileImage: {
            url: user.image,
            publicId: publicId,
            folder: '',
            provider: 'cloudinary',
            resourceType: 'image',
          },
        },
      }
    );
    migrated++;
  }

  console.log(`Migrated ${migrated} users with existing images to profileImage format`);
}

export async function down(db) {
  await db
    .collection('users')
    .updateMany(
      { profileImage: { $exists: true } },
      { $unset: { profileImage: '' } }
    );
  console.log('Reverted profileImage migration');
}
