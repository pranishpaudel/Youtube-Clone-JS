import mongoose from 'mongoose';
import { DB_NAME } from '/Users/air/Desktop/Youtube Clone JS/src/constants.js';



const connectDB= async ()=>{
    try{
const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
console.log(`MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
         console.log("MongoDB connection error",error);
    }
    
}



export default connectDB