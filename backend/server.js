const express = require('express');
const cors = require('cors');
const helmet= require('helmet');
const logger=require('./config/logger');
const connectDb=require('./config/db');
const path = require("path");

//roters
const authRouter=require("./routes/authRoutes");
const contactRouter=require('./routes/contactRoutes');
//middlwares
const authMiddleware=require('./middlewares/authMiddleware');
const errorHandler=require('./middlewares/errorHandler');
//dotenv
require("dotenv").config({path:"backend/.env"});

const app= express();
//using middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

//dbconnect
PORT=process.env.PORT||8080;
connectDb();

//routes
app.use('/api/auth',authRouter);
app.use('/api/user',authMiddleware,contactRouter); //auth middleware used

app.use(errorHandler);
app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`);
});

