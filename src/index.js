import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';
import connectDB from './db/index.js';
import 'dotenv/config';
import {app} from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongo Db connection failed",err)
})

// const app= express();
// (async ()=>{
// try{
// await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// app.on("error",(error)=>{
//     console.log("Error",error);
//     throw error;
// })
// app.listen(process.env.PORT, ()=>{
//     console.log(`App is listening on port ${process.env.PORT}`);
// })

// }
// catch(error){
//     console.log("Error",error)

// }
// })()