const jwt = require("jsonwebtoken");

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: "❌ Access token required",
      message: "Please provide a valid authorization token"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Auth Token Error:", err.message);
      return res.status(403).json({ 
        error: "❌ Invalid or expired token",
        message: "Please login again to get a fresh token"
      });
    }
    
    // Verify decoded token has email
    if (!decoded.email) {
      return res.status(403).json({ 
        error: "❌ Invalid token payload",
        message: "Token is missing user information"
      });
    }
    
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
