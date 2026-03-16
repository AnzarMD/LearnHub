const success   = (res, data={}, message="Success", statusCode=200) => res.status(statusCode).json({ success: true, message, data });
const created   = (res, data={}, message="Created") => success(res, data, message, 201);
const paginated = (res, items, total, page, limit, message="Success") =>
  res.status(200).json({ success: true, message, data: { items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } } });
const error     = (res, message="Error", statusCode=500, errors=null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });
module.exports = { success, created, paginated, error };
