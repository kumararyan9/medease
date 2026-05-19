class ApiResponse {
  static success(res, { data = null, message = 'Success', statusCode = 200 } = {}) {
    const body = { success: true, message };
    if (data !== null) {
      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.assign(body, data);
      } else {
        body.data = data;
      }
    }
    return res.status(statusCode).json(body);
  }

  static created(res, { data = null, message = 'Created successfully' } = {}) {
    return ApiResponse.success(res, { data, message, statusCode: 201 });
  }

  static error(res, { message = 'Internal server error', statusCode = 500, traceId = null } = {}) {
    const body = { success: false, message };
    if (traceId) body.traceId = traceId;
    return res.status(statusCode).json(body);
  }
}

export default ApiResponse;
