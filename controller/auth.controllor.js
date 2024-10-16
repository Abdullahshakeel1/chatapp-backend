import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import People from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const sign_up = async (req, res, next) => {
    const { username, password, email, confirmPassword, gender } = req.body;
    console.log("Request Body:", req.body);

    try {
        if (!username || !email || !password || !confirmPassword || !gender) {
            return next(errorHandler(400, "All fields are required"));
        }

        if (password.trim() !== confirmPassword.trim()) {
            return next(errorHandler(400, "Passwords do not match"));
        }
        const user = await People.findOne({ username });
        if (user) {
            return next(errorHandler(400, "Username already exists"));
        }

        const existingUser = await People.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "Email already exists"));
        }
        const profilepic = gender === 'male'
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const hashpassword = await bcrypt.hash(password.trim(), 10);
        const newUser = new People({
            username,
            password: hashpassword,
            email,
            gender,
            profilepic,
        });
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_KEY);
        res.cookie("token", token, { httpOnly: true });
        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });

    } catch (error) {
        next(error);
    }
};



export const log_in=async(req,res,next)=>{
    try {
        const { email, password } = req.body;
        const validuser = await People.findOne({email})
        if (!validuser) {
            return next(errorHandler(401, "Invalid email "))
        }
        const validpassword =bcrypt.compareSync(password,validuser.password)
        if (!validpassword) {
            return next(errorHandler(401, "Invalid password"))
        }
   
            // Generate a JWT token
        const token = jwt.sign({ _id: validuser._id }, process.env.JWT_KEY);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Logged in successfully", user: {
            _id: validuser._id,
            username: validuser.username,
            email: validuser.email,
            gender: validuser.gender,
            profilepic: validuser.profilepic,
            password: validuser.password
        } });
            

        
    } catch (error) {
        next(error);
    }

}
export const logout=async(req,res,next)=>{
try {
    res.clearCookie("token")
    res.status(200).json({ message: "Logged out successfully" });
} catch (error) {
    next(error);
}


}
export const allUSers = async(req, res, next)=>{
    try {
        const users = await People.find({});
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
}