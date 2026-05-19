export async function up(db) {
  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  const required = ['roles', 'users', 'specialities', 'doctorprofiles', 'patientprofiles', 'appointments', 'prescriptions', 'medicalreports', 'progressnotes'];

  for (const col of required) {
    if (!collections.includes(col)) {
      await db.createCollection(col);
    }
  }

  // Roles
  await db.collection('roles').createIndex({ name: 1 }, { unique: true });
  await db.collection('roles').createIndex({ slug: 1 }, { unique: true });

  // Users
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // Specialities
  await db.collection('specialities').createIndex({ name: 1 }, { unique: true });
  await db.collection('specialities').createIndex({ slug: 1 }, { unique: true });

  // DoctorProfiles
  await db.collection('doctorprofiles').createIndex({ userId: 1 }, { unique: true });
  await db.collection('doctorprofiles').createIndex({ specialityId: 1, available: 1 });

  // PatientProfiles
  await db.collection('patientprofiles').createIndex({ userId: 1 }, { unique: true });

  // Appointments
  await db.collection('appointments').createIndex({ doctorId: 1, slotStart: 1 }, { unique: true });
  await db.collection('appointments').createIndex({ patientId: 1 });
  await db.collection('appointments').createIndex({ doctorId: 1, status: 1 });
  await db.collection('appointments').createIndex({ slotStart: 1 });

  // Prescriptions
  await db.collection('prescriptions').createIndex({ patientId: 1 });
  await db.collection('prescriptions').createIndex({ appointmentId: 1 });

  // MedicalReports
  await db.collection('medicalreports').createIndex({ patientId: 1 });

  // ProgressNotes
  await db.collection('progressnotes').createIndex({ patientId: 1 });
}

export async function down(db) {
  const cols = ['roles', 'users', 'specialities', 'doctorprofiles', 'patientprofiles', 'appointments', 'prescriptions', 'medicalreports', 'progressnotes'];
  for (const col of cols) {
    await db.collection(col).drop().catch(() => {});
  }
}
