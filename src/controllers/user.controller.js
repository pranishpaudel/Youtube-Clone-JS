import { ApiError } from '../../utils/ApiError.js';
import {asyncHandler} from '/Users/air/Desktop/Youtube Clone JS/utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';


const generateAccessRefreshTokens= async (userId) => {
try{
const user= await User.findById(userId);
console.log(`Second user: ${user}`);
const accessToken= user.generateAccessToken;
const refreshToken= user.generateRefreshoken;
user.refreshToken= refreshToken;
await user.save({validateBeforeSave: false});
return {accessToken,refreshToken};
}
catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token");
}
}
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
//  const coverImageLocalPath=  homis?.coverimage[0]?.path;
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


export const loginUser= asyncHandler(async(req,res)=>{
    console.log(req.body);
    const {email,username,password}=  req.body;
    console.log(email,username,password);

    if (!username || !email){
        throw new ApiError(400,"Username or email is a required field");
    }

    const user= await User.findone({
        $or: [{username},{email}]
    })
console.log(`First user: ${user}`);
    if (!user){
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordValid= await user.isPasswordCorrect(password);
    if(!isPasswordValid){
throw new ApiError(404,"The password does not match your email or username");
    }
    const {accessToken,refreshToken} = await generateAccessRefreshTokens(user._id);
//Grab the access and refresh token from the user
})