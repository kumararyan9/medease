import asyncHandler from '@/utils/asyncHandler.js';
import ApiResponse from '@/utils/apiResponse.js';
import * as appointmentService from './appointment.service.js';

const create = asyncHandler(async (req, res) => {
  const { docId, slotDate, slotTime, slotStart, appointmentType, symptoms } = req.body;

  let slotStartISO = slotStart;
  if (!slotStartISO && slotDate && slotTime) {
    slotStartISO = new Date(`${slotDate}T${slotTime}:00.000Z`).toISOString();
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

export { create, getById, cancel, makePayment };
