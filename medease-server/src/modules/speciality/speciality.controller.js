import asyncHandler from '@/utils/asyncHandler.js';
import ApiResponse from '@/utils/apiResponse.js';
import * as specialityService from './speciality.service.js';

const getAll = asyncHandler(async (req, res) => {
  const specialities = await specialityService.getAll();
  ApiResponse.success(res, { data: { specialities } });
});

const getActive = asyncHandler(async (req, res) => {
  const specialities = await specialityService.getActive();
  ApiResponse.success(res, { data: { specialities } });
});

const getById = asyncHandler(async (req, res) => {
  const speciality = await specialityService.getById(req.params.id);
  ApiResponse.success(res, { data: { speciality } });
});

const create = asyncHandler(async (req, res) => {
  const speciality = await specialityService.create(req.body);
  ApiResponse.created(res, { data: { speciality }, message: 'Speciality created' });
});

const update = asyncHandler(async (req, res) => {
  const speciality = await specialityService.update(req.params.id, req.body);
  ApiResponse.success(res, { data: { speciality }, message: 'Speciality updated' });
});

const remove = asyncHandler(async (req, res) => {
  const result = await specialityService.remove(req.params.id);
  ApiResponse.success(res, { data: result });
});

export { getAll, getActive, getById, create, update, remove };
