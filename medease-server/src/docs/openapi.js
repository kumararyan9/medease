const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'MedEase API',
    version: '2.0.0',
    description:
      'Doctor appointment booking system API — manages users, doctors, patients, appointments, specialities, and admin operations.',
    contact: { name: 'Kumar Aryan' },
  },
  servers: [{ url: '/api', description: 'API base path' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token from login/register',
      },
      legacyToken: { type: 'apiKey', in: 'header', name: 'token', description: 'Legacy patient token header' },
      legacyAToken: { type: 'apiKey', in: 'header', name: 'atoken', description: 'Legacy admin token header' },
      legacyDToken: { type: 'apiKey', in: 'header', name: 'dtoken', description: 'Legacy doctor token header' },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          traceId: { type: 'string' },
        },
      },
      ProfileImage: {
        type: 'object',
        description: 'Structured image metadata from storage service',
        properties: {
          url: { type: 'string', format: 'uri', description: 'CDN/public URL of the uploaded image' },
          publicId: { type: 'string', description: 'Cloudinary public ID (used for deletion/replacement)' },
          folder: { type: 'string', description: 'Storage folder path (e.g. medease/patients/profile)' },
          provider: { type: 'string', enum: ['cloudinary'], description: 'Storage provider name' },
          resourceType: { type: 'string', enum: ['image'], description: 'Type of resource stored' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['ADMIN', 'DOCTOR', 'PATIENT'] },
          image: { type: 'string', description: 'Direct image URL (legacy field, kept for backward compatibility)' },
          profileImage: { $ref: '#/components/schemas/ProfileImage' },
          phone: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Speciality: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      DoctorProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          image: { type: 'string' },
          profileImage: { $ref: '#/components/schemas/ProfileImage' },
          phone: { type: 'string' },
          speciality: { $ref: '#/components/schemas/Speciality' },
          degree: { type: 'string' },
          experienceYears: { type: 'number' },
          about: { type: 'string' },
          consultationFee: { type: 'number' },
          address: { type: 'object' },
          available: { type: 'boolean' },
          languages: { type: 'array', items: { type: 'string' } },
          ratingAverage: { type: 'number' },
          totalPatients: { type: 'number' },
          licenseNumber: { type: 'string' },
          hospitalAffiliation: { type: 'string' },
          onlineConsultationEnabled: { type: 'boolean' },
        },
      },
      PatientProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          image: { type: 'string' },
          profileImage: { $ref: '#/components/schemas/ProfileImage' },
          phone: { type: 'string' },
          gender: { type: 'string' },
          dob: { type: 'string' },
          address: { type: 'object' },
          bloodGroup: { type: 'string' },
          allergies: { type: 'array', items: { type: 'string' } },
          emergencyContact: { type: 'object' },
        },
      },
      DoctorListItem: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          image: { type: 'string' },
          phone: { type: 'string' },
          speciality: { $ref: '#/components/schemas/Speciality' },
          degree: { type: 'string' },
          experienceYears: { type: 'number' },
          about: { type: 'string' },
          consultationFee: { type: 'number' },
          address: { type: 'object' },
          available: { type: 'boolean' },
          languages: { type: 'array', items: { type: 'string' } },
          ratingAverage: { type: 'number' },
          totalPatients: { type: 'number' },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          doctorId: { type: 'string' },
          patientId: { type: 'string' },
          slotStart: { type: 'string', format: 'date-time' },
          slotEnd: { type: 'string', format: 'date-time' },
          paymentAmount: { type: 'number' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] },
          paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'REFUNDED'] },
          appointmentType: { type: 'string', enum: ['ONLINE', 'OFFLINE'] },
          cancelledBy: { type: 'string', enum: ['PATIENT', 'DOCTOR', 'ADMIN'] },
          symptoms: { type: 'string' },
          meetingLink: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      SlotsResponse: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          availableSlots: { type: 'array', items: { type: 'string' } },
          bookedSlots: { type: 'array', items: { type: 'string' } },
          allSlots: { type: 'array', items: { type: 'string' } },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          traceId: { type: 'string' },
          details: { type: 'array', items: { type: 'string' }, description: 'Validation error details' },
        },
      },
    },
  },
  paths: {
    '/user/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new patient account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', minLength: 8, example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { description: 'Validation error / email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'User limit reached' },
        },
      },
    },
    '/user/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login as a patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: 'Invalid email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Account deactivated' },
        },
      },
    },
    '/user/get-profile': {
      get: {
        tags: ['Patient'],
        summary: 'Get authenticated patient profile',
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        responses: {
          200: {
            description: 'Patient profile with user + profile data',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        userData: { $ref: '#/components/schemas/PatientProfile' },
                        profileData: { $ref: '#/components/schemas/PatientProfile' },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: 'Authentication required' },
        },
      },
    },
    '/user/update-profile': {
      post: {
        tags: ['Patient'],
        summary: 'Update patient profile (including profile image)',
        description: 'Upload a new profile image via multipart/form-data. The image is uploaded to Cloudinary under medease/patients/profile. If the user already has a profileImage with a publicId, the old image is automatically deleted after the new one is uploaded.',
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Full name' },
                  phone: { type: 'string', description: 'Phone number' },
                  address: { type: 'string', description: 'JSON string: { "line1": "...", "line2": "..." }' },
                  dob: { type: 'string', example: '1990-01-15' },
                  gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                  image: { type: 'string', format: 'binary', description: 'Profile image file (jpeg/png/webp, max 5MB)' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated — returns full profile including profileImage metadata',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        userData: { $ref: '#/components/schemas/PatientProfile' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { description: 'Validation error / invalid file type / file too large' },
        },
      },
    },
    '/user/appointments': {
      get: {
        tags: ['Patient'],
        summary: "Get authenticated patient's appointments",
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        responses: {
          200: {
            description: 'List of patient appointments',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        appointments: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/user/book-appointment': {
      post: {
        tags: ['Appointment'],
        summary: 'Book a new appointment',
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['docId', 'slotDate', 'slotTime'],
                properties: {
                  docId: { type: 'string', description: 'Doctor user ID' },
                  slotDate: { type: 'string', example: '2024-03-15' },
                  slotTime: { type: 'string', example: '10:00' },
                  symptoms: { type: 'string' },
                  appointmentType: { type: 'string', enum: ['ONLINE', 'OFFLINE'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Appointment booked' } },
      },
    },
    '/user/cancel-appointment': {
      post: {
        tags: ['Appointment'],
        summary: 'Cancel an appointment (patient)',
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId'],
                properties: { appointmentId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Appointment cancelled' } },
      },
    },
    '/user/make-payment': {
      post: {
        tags: ['Appointment'],
        summary: 'Make payment for an appointment',
        security: [{ bearerAuth: [] }, { legacyToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId'],
                properties: { appointmentId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Payment successful' } },
      },
    },
    '/admin/login': {
      post: {
        tags: ['Admin'],
        summary: 'Admin login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@medease.in' },
                  password: { type: 'string', example: 'Admin@1234' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful, returns token' } },
      },
    },
    '/admin/add-doctor': {
      post: {
        tags: ['Admin'],
        summary: 'Add a new doctor (admin only)',
        description: 'Creates a new doctor user + profile. The profile image is uploaded to Cloudinary under medease/doctors/profile.',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'specialityId', 'degree', 'experienceYears', 'about', 'consultationFee', 'address', 'image'],
                properties: {
                  name: { type: 'string', description: 'Doctor full name' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  specialityId: { type: 'string', description: 'Speciality ObjectId' },
                  degree: { type: 'string', description: 'Medical degree / education' },
                  experienceYears: { type: 'number', description: 'Years of experience' },
                  about: { type: 'string', description: 'Bio / about the doctor' },
                  consultationFee: { type: 'number', description: 'Consultation fee' },
                  address: { type: 'string', description: 'JSON string: { "line1": "...", "line2": "..." }' },
                  image: { type: 'string', format: 'binary', description: 'Doctor profile image (jpeg/png/webp, max 5MB)' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Doctor added successfully with profileImage metadata stored' },
          400: { description: 'Validation error / invalid file type' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/admin/all-doctors': {
      get: {
        tags: ['Admin'],
        summary: 'Get all doctors (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        responses: {
          200: {
            description: 'List of all doctors with profiles (includes image and profileImage fields)',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        doctors: { type: 'array', items: { $ref: '#/components/schemas/DoctorListItem' } },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/admin/change-availability': {
      post: {
        tags: ['Admin'],
        summary: 'Toggle doctor availability (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['docId'],
                properties: { docId: { type: 'string', description: 'Doctor user ID' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Availability changed' } },
      },
    },
    '/admin/appointments': {
      get: {
        tags: ['Admin'],
        summary: 'Get all appointments (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        responses: { 200: { description: 'List of all appointments' } },
      },
    },
    '/admin/cancel-appointment': {
      post: {
        tags: ['Admin'],
        summary: 'Cancel any appointment (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId'],
                properties: { appointmentId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Appointment cancelled' } },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Admin dashboard statistics',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        responses: { 200: { description: 'Dashboard data with counts and latest appointments' } },
      },
    },
    '/doctor/list': {
      get: {
        tags: ['Doctor'],
        summary: 'Get public list of available doctors',
        responses: {
          200: {
            description: 'List of available doctors',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        doctors: { type: 'array', items: { $ref: '#/components/schemas/DoctorListItem' } },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/doctor/login': {
      post: {
        tags: ['Doctor'],
        summary: 'Doctor login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful, returns token' } },
      },
    },
    '/doctor/appointments': {
      get: {
        tags: ['Doctor'],
        summary: "Get doctor's appointments",
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        responses: { 200: { description: 'List of appointments for the authenticated doctor' } },
      },
    },
    '/doctor/complete-appointment': {
      post: {
        tags: ['Doctor'],
        summary: 'Mark appointment as completed',
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId'],
                properties: { appointmentId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Appointment completed' } },
      },
    },
    '/doctor/cancel-appointment': {
      post: {
        tags: ['Doctor'],
        summary: 'Cancel an appointment (doctor)',
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointmentId'],
                properties: { appointmentId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Appointment cancelled' } },
      },
    },
    '/doctor/dashboard': {
      get: {
        tags: ['Doctor'],
        summary: 'Doctor dashboard statistics',
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        responses: { 200: { description: 'Dashboard data with earnings and latest appointments' } },
      },
    },
    '/doctor/profile': {
      get: {
        tags: ['Doctor'],
        summary: 'Get doctor profile',
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        responses: {
          200: {
            description: 'Doctor profile with user and professional details (includes image and profileImage)',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        profileData: { $ref: '#/components/schemas/DoctorProfile' },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/doctor/update-profile': {
      post: {
        tags: ['Doctor'],
        summary: 'Update doctor profile (text fields only)',
        description: 'Note: Doctor profile image updates are not supported via this endpoint yet.',
        security: [{ bearerAuth: [] }, { legacyDToken: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  consultationFee: { type: 'number' },
                  address: { type: 'string', description: 'JSON string: { "line1": "...", "line2": "..." }' },
                  available: { type: 'boolean' },
                  about: { type: 'string' },
                  languages: { type: 'string', description: 'JSON array of strings: ["English","Hindi"]' },
                  hospitalAffiliation: { type: 'string' },
                  onlineConsultationEnabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/doctors/{id}/slots': {
      get: {
        tags: ['Doctor'],
        summary: 'Get available slots for a doctor on a date',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'date', in: 'query', required: true, schema: { type: 'string', example: '2024-03-15' } },
        ],
        responses: {
          200: {
            description: 'Available slots',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SlotsResponse' } } },
          },
        },
      },
    },
    '/specialities': {
      get: {
        tags: ['Speciality'],
        summary: 'Get all specialities',
        responses: { 200: { description: 'List of all specialities' } },
      },
      post: {
        tags: ['Speciality'],
        summary: 'Create a new speciality (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Cardiology' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Speciality created' } },
      },
    },
    '/specialities/active': {
      get: {
        tags: ['Speciality'],
        summary: 'Get all active specialities',
        responses: { 200: { description: 'List of active specialities' } },
      },
    },
    '/specialities/{id}': {
      get: {
        tags: ['Speciality'],
        summary: 'Get a speciality by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Speciality details' } },
      },
      put: {
        tags: ['Speciality'],
        summary: 'Update a speciality (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  isActive: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Speciality updated' } },
      },
      delete: {
        tags: ['Speciality'],
        summary: 'Delete a speciality (admin only)',
        security: [{ bearerAuth: [] }, { legacyAToken: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Speciality deleted' } },
      },
    },
  },
};

module.exports = openApiSpec;
