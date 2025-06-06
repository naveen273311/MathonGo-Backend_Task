const ADMIN_SECRET = "Naveen321"; // <--- Define it here

module.exports = function (req, res, next) {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken && adminToken === ADMIN_SECRET) {
    next();
  } else {
    return res.status(403).json({ error: "Admin access required" });
  }
};
