import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";

export const generateToken = (res:Response, user: any | IUserDocument)=>{
    const token = jwt.sign({userId:user._id},process.env.SECRET_KEY!, {expiresIn:'1D'});
    res.cookie("token", token, {httpOnly:true, sameSite:'strict', maxAge:24*60*60*1000});
    return token; 
}