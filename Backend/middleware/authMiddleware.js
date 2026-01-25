const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];

  // Check if token exists
  if (!header) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // allow request to continue
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
