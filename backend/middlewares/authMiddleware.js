const jwt=require('jsonwebtoken');
const asyncHandler=require("express-async-handler");
const logger=require('../config/logger');
const AuthMiddleware= asyncHandler(async(req, res, next)=>{
    token = req.headers.authorization.split(' ')[1];
    if(!token){
        throw new Error("Not authorized, token required");
    }
    jwt.verify(token,process.env.JWT_SECRET,function (err,decoded){
        if(err){
            throw new Error("Not authorized, token invalid");
        }
        logger.info(decoded);
        req.userId=decoded.id;
        logger.info(req.userId);
        next();
    });
});

module.exports=AuthMiddleware;