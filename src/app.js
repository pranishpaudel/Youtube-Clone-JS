import express from 'express';
import cors from 'cros';
import cookieParser from 'cookie-parser';
import 'dotenv/config';


const app= express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser());

//routes import 
import {userRouter} from '../routes/user.routes.js'
export {app};