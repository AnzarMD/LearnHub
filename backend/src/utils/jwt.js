const jwt = require("jsonwebtoken");
const signAccess    = (p) => jwt.sign(p, process.env.JWT_ACCESS_SECRET,  { expiresIn: process.env.JWT_ACCESS_EXPIRES  || "15m" });
const signRefresh   = (p) => jwt.sign(p, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" });
const verifyAccess  = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET);
const verifyRefresh = (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET);
module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
