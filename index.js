require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyparser = require('body-parser');
require('./config/db_connection');

const userRouter = require('./routes/userRoute');

const app = express();

app.use(express.json());

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended:true }));

app.use(cors());

// app.use('/image',express.static('upload/images'));
app.use(express.static('public'));

app.use('/api',userRouter);

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.statusMessage = err.statusMessage || "Internal Server Error";
    res.statusCode(err.statusCode).json({
        statusMessage:err.statusMessage,
    });
});

app.listen(3000,()=> console.log("server connected!"));
