const jwt = require("jsonwebtoken");
const User = require("../models/user");

const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
    let token;
    // Check if token exists in Header
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            //Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from DB (without password)
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            return next(new AppError("Not Authorized, no token", 401));
        }
    }
    if(!token){
        return next(new AppError("Not Authorized, no token", 401));
    }
};

module.exports = { protect };