const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const AppError = require("../utils/AppError");

const registerUser = async (req, res, next) => {
    try{
        const {name, email, password} = req.body;

        // 1. Validate Input
        if (!name || !email || !password){
            return next(new AppError("All fields are required", 400));
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return next(new AppError("User already exists", 400));
        }

        //3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        });

        // 5. Send Response
        res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        console.error(error);
        res.status(501).json({
            message: "Server Error"
        });
    }
};

const jwt = require("jsonwebtoken");

const loginUser = async (req,res, next) => {
    try {
        const {email, password} = req.body;

        // 1. Validate Input
        if(!email || !password){
            return next(new AppError("All fields are Required", 400));
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if(!user){
            res.status(400).json({
                message: "User Does not Exist"
            });
        }

        // 3. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({
                message: "Incorrect Password"
            });
        }

        // 4. Create JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        // 5. Send Response
        res.status(201).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        console.error(error);
        res.status(501).json({
            message: "Server Error"
        });
    }
};

module.exports = { registerUser, loginUser };
