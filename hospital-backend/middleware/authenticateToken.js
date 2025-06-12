const jwt = require("jsonwebtoken");
const LogoutController = require("../controllers/register/LogoutController");

const authenticateToken = (req, res, next) => {
    console.log("=== Authentication Middleware ===");
    console.log("Headers received:", req.headers);
    
    const authHeader = req.headers["authorization"];
    console.log("Auth header:", authHeader);
    
    const token = authHeader && authHeader.split(" ")[1]; 
    console.log("Extracted token:", token ? "Token present" : "No token");

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ 
            success: false,
            message: "Access denied. No token provided." 
        });
    }

    // Check if token is blacklisted (logged out)
    if (LogoutController.isTokenBlacklisted(token)) {
        console.log("Token is blacklisted (user logged out)");
        return res.status(401).json({
            success: false,
            message: "Token has been invalidated. Please login again."
        });
    }

    try {
        console.log("Verifying token with secret:", process.env.JWT_SECRET ? "Secret present" : "No secret");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);
        
        req.user = decoded;
        console.log("User set in request:", req.user);
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ 
            success: false,
            message: "Invalid token",
            error: err.message 
        });
    }
};

module.exports = authenticateToken;