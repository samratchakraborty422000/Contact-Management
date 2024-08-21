const errorHandler = (err,req,res,next)=>{
    const statusCode= res.statusCode|| 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
};

module.exports= errorHandler;