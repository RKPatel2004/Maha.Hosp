const jwt = require("jsonwebtoken");

let tokenBlacklist = new Set();

class LogoutController {
    static async logout(req, res) {
        try {
            console.log("=== Logout Process Started ===");
            console.log("User from request:", req.user);
            
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            
            if (!token) {
                console.log("No token found in request");
                return res.status(400).json({
                    success: false,
                    message: "Token not found"
                });
            }

            console.log("Token to blacklist:", token ? "Token present" : "No token");

            tokenBlacklist.add(token);
            console.log("Token added to blacklist. Total blacklisted tokens:", tokenBlacklist.size);

            console.log(`User ${req.user.userId} (${req.user.mobile}) logged out successfully`);

            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
                data: {
                    userId: req.user.userId,
                    mobile: req.user.mobile,
                    logoutTime: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during logout",
                error: error.message
            });
        }
    }

    static isTokenBlacklisted(token) {
        return tokenBlacklist.has(token);
    }

    static clearExpiredTokens() {
        console.log("Clearing expired tokens from blacklist...");
        const currentTime = Math.floor(Date.now() / 1000);
        
        tokenBlacklist.forEach(token => {
            try {
                const decoded = jwt.decode(token);
                if (decoded && decoded.exp && decoded.exp < currentTime) {
                    tokenBlacklist.delete(token);
                    console.log("Removed expired token from blacklist");
                }
            } catch (err) {
                tokenBlacklist.delete(token);
                console.log("Removed invalid token from blacklist");
            }
        });
        
        console.log("Cleanup complete. Remaining blacklisted tokens:", tokenBlacklist.size);
    }
    static getBlacklistSize() {
        return tokenBlacklist.size;
    }
}

module.exports = LogoutController;