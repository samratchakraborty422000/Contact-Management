const mongoose=require("mongoose");
const logger=require("../config/logger");
require("dotenv").config();
const connectDb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connected");

    }
    catch(error){
        logger.error(error);
        process.exit(1); // Exit the application with a failure status code
    }
}

module.exports=connectDb;