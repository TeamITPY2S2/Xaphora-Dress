// backend/middleware/jwtMiddleware.js

const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT passed in the Authorization header.
 * On success, attaches decoded payload to req.user and calls next().
 * On failure, responds with 401 Unauthorized.
 */
const verifyToken = (req, res, next) => {
  // 1) Check for Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2) Extract the token string
  const token = authHeader.split(" ")[1];

  // 3) Verify & decode
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload (e.g. { adminId, adminType } or { userId, role }) 
    // so downstream handlers can identify the user
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;