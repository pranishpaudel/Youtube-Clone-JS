import { ApiError } from '../../utils/ApiError.js';
import {asyncHandler} from '/Users/air/Desktop/Youtube Clone JS/utils/asyncHandler.js';
import { User } from '../models/user.models.js';



export const registerUser= asyncHandler(async (req,res) =>{
    const {fullname, email, username, password}= req.body;
    if(
        [fullname, email, username, password].some((field)=>field===undefined || field.trim==='')
       
    ){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser= User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }
    console.log(fullname, email, username, password);

})