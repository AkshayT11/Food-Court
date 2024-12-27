import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";

export const Signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                message: "User is alerady Exist with Same Email",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationCode();

        user = await User.create({
            fullname,
            email,
            password: hashPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        generateToken(res,user);

        await sendVerificationEmail(email,verificationToken);

        const userWithourPassword = await User.findOne({ email }).select("-password")

        return res.status(201).json({
            success: true,
            message: "Account created Successfully",
            user:userWithourPassword
        })

    } catch (error) {
        console.log("Signup Error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
};

// For Login

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                message: "Incorrect Email or Password"
            });
        };

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            res.status(401).json({
                message: "Incorrect Password"
            });
        };

        generateToken(res, user);

        user.lastLogin = new Date();
        await user.save();

        // send user without password
        const userWithourPassword = (await User.findOne({ email }).select("-password"));

        return res.status(200).json({
            success: true,
            message: `Welcome Back ${user.fullname}`,
            user: userWithourPassword
        })

    } catch (error) {
        console.log("Login Error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }

}


// Verify Email

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body;
     
        
        const user = await User.findOne({ verificationToken: verificationCode, 
            verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

            if(!user){
                return res.status(400).json({
                    message:"Invalid or Expired verification token",
                    success:false
                });
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            await user.save();

            // Send Welcome Email to user
            await sendWelcomeEmail(user.email, user.fullname);

            return res.status(200).json({
                success:true,
                message:"Email Verified Successfully",
                user,
            })

    } catch (error) {
        console.log("Verification Email Error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
};

// For Logout

export const Logout = async(req:Request,res:Response)=>{
    try {
        return res.clearCookie("token").status(200).json({
            success:true,
            message:"Logged out SuccessFully"
        })
    } catch (error) {
        console.log("Logout Error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
};

// Forgot Password

export const forgotPassword = async(req:Request,res:Response)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesn't exist"
            })
        };

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now()+1*60*60*100); //1hr timing

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // Send Email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`);

        return res.status(200).json({
            success:true,
            message:"Password reset link sent to your Email"
        })


    } catch (error) {
        console.log("Forgot Password Error", error);
        return res.status(500).json({ message: "Internal Server error" })
        
    }
};

// Reset Password
export const resetPassword = async(req:Request,res:Response)=>{
    try {
        const {token} = req.params;
        const {newPassword} = req.body;

        const user = await User.findOne({resetPasswordToken:token,
            resetPasswordTokenExpiresAt:{$gt:Date.now()}});

            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"Invalid or Expired reset token"
                });
            }
            // Update Password
            const hashedPassword = await bcrypt.hash(newPassword,10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpiresAt = undefined;
            await user.save();

            //Send success Reset Email
            await sendResetSuccessEmail(user.email);

            return res.status(200).json({
                success:true,
                message:"Password Reset SuccessFully"
            })

    } catch (error) {
        console.log("Reset Password Error", error);
        return res.status(500).json({ message: "Internal Server error" })
    }
}

// Auth

export const checkAuth = async(req:Request,res:Response)=>{
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        };

        return res.status(200).json({
            success:true,
            user
        });

    } catch (error) {
        console.log("Reset Password Error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Update Profile

export const updateProfile = async(req:Request,res:Response)=>{
    try {
        const userId = req.id;
        const {fullname,email,address, city, country, profilePicture} = req.body;

        // upload image on cloudinary
        let cloudResponse:any    
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        
        const updatedData = {fullname,email,address, city, country, profilePicture};

        const user = await User.findByIdAndUpdate(userId,updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user,
            message:"Profile Updated Successfully"
        })


    } catch (error) {
        console.log("Reset Password Error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}