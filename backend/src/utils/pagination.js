const parsePagination = (q) => {
  const page  = Math.max(1,   parseInt(q.page  || "1",  10));
  const limit = Math.min(100, parseInt(q.limit || "20", 10));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};
const buildSearch = (fields, term) => {
  if (!term) return {};
  return { OR: fields.map((f) => ({ [f]: { contains: term, mode: "insensitive" } })) };
};
module.exports = { parsePagination, buildSearch };
