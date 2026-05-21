const asyncHandler = require('@/utils/asyncHandler');
const ApiResponse = require('@/utils/apiResponse');
const appointmentService = require('./appointment.service');

const create = asyncHandler(async (req, res) => {
  const { docId, slotDate, slotTime, slotStart, appointmentType, symptoms } = req.body;

  let slotStartISO = slotStart;
  if (!slotStartISO && slotDate && slotTime) {
    const parts = slotDate.split('_');
    if (parts.length !== 3) {
      return ApiResponse.error(res, { message: 'Invalid slotDate or slotTime format.' });
    }
    const [day, month, year] = parts;
    const [timePart, modifier] = slotTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;
    const parsed = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    if (isNaN(parsed.getTime())) {
      return ApiResponse.error(res, { message: 'Invalid slotDate or slotTime format.' });
    }
    slotStartISO = parsed.toISOString();
  }

  const appointment = await appointmentService.createAppointment(
    req.user.id,
    docId,
    slotStartISO,
    appointmentType,
    symptoms
  );
  ApiResponse.created(res, {
    data: { appointment },
    message: 'Appointment booked successfully.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getById(req.params.id);
  ApiResponse.success(res, { data: { appointment } });
});

const cancel = asyncHandler(async (req, res) => {
  const result = await appointmentService.cancelAppointment(
    req.body.appointmentId,
    req.user.id,
    req.user.role
  );
  ApiResponse.success(res, { data: result });
});

const makePayment = asyncHandler(async (req, res) => {
  const result = await appointmentService.makePayment(req.body.appointmentId, req.user.id);
  ApiResponse.success(res, { data: result });
});

module.exports = { create, getById, cancel, makePayment };
