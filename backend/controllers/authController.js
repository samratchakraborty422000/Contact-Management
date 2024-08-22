const asyncHandler=require('express-async-handler');
const User=require('../models/user');
const logger=require('../config/logger');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
/*
@desc Register a new user
@route POST /api/auth/register
@access public
*/

const registerUser= asyncHandler(async (req,res)=>{
    const {name,email,phone,password }=req.body;
    if(!name || !email || !phone || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const userExist= await User.findOne({email});
    if(userExist) {
        return res.status(400).json({message:"User already registered"});
    }
    const user=await User.create({
        name,
        email,
        phone,
        password,
    });
    if(!user){
        return res.status(400).json({message:"User registration failed"});

    }

    logger.info("user registered successfully");
    return res.status(201).json({
        success:true,
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
        }
    });

});

/*
@desc Login an  user
@route POST /api/auth/login
@access public
*/

const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(404),json({message: "User not found"});
    }
    const isMatched=await user.matchPassword(password);
    if(!isMatched){
        return res.status(401).json({message: "Invalid password"});
    }

    logger.info("User matched password");
    const token =await jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"1d"});
    return res.status(201).json({
        success:true,
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            token:token,
        }
    });
});

/*
@desc GET an  user
@routeGET /api/auth/profie
@access private
*/

const getUserProfile = asyncHandler(async (req, res) => {
    const user= await User.findById(req.userId); //check the authMiddleware 
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    logger.info("User profile fetched successfully");
    return res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
    });
});

module.exports={
    registerUser,
    loginUser,
    getUserProfile,
};
