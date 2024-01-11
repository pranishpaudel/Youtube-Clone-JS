import { ApiError } from '../../utils/ApiError.js';
import {asyncHandler} from '/Users/air/Desktop/Youtube Clone JS/utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
//In

export const registerUser= 
asyncHandler(async (req,res) =>{
    const {fullname, email, username, password}= req.body;
    if(
        [fullname, email, username, password].some((field)=>field===undefined || field.trim==='')
       
    ){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser= await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }
const homis= await req.files;
console.log(homis);
    const avatarLocalPath=  homis?.avatar[0]?.path;
    // const coverImageLocalPath=  homis?.coverimage[0]?.path;
if (!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
}

const avatar= await uploadOnCloudinary(avatarLocalPath);
console.log(avatar);
// const coverImage= await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
   new ApiError(400,"Avatar File is Required")
}

const user= await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: "",
    email,
    password,
    username: username.toLowerCase()
})

console.log(user);
const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
    )
    console.log(createdUser);
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successuly")
    )

})