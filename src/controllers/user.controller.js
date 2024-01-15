import { ApiError } from '../../utils/ApiError.js';
import {asyncHandler} from '/Users/air/Desktop/Youtube Clone JS/utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import jwt  from 'jsonwebtoken';


const generateAccessRefreshTokens= async (userId) => {
try{
const user= await User.findById(userId);
// console.log(`Second user: ${user}`);
const accessToken= user.generateAccessToken();
const refreshToken= user.generateRefreshoken();
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
//     const email= "insa@gmail.com";
//     const username= "theinsa55";
//    const   password= "Insan";
    // console.log(email,username,password);

    if (!username || !email){
        throw new ApiError(400,"Username or email is a required field");
    }

    const user= await User.findOne({
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
    console.log(accessToken,refreshToken);

    const loggedInUser= await User.findById(user._id);
    console.log(loggedInUser);

    const options= {
        httponly: true,
        secure: true,
    }


    return res
    .status(400)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser ,accessToken,refreshToken
            },
            "User logged in successfuly"
        )
    )

    console.log(req.cookies);
//Grab the access and refresh token from the user
})



export const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options= {
        httponly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"));
})



export const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        // const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        const incomingRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWEyMGU2NzQyNGZmMGIwY2NiOGRhNmEiLCJlbWFpbCI6Imluc2FAZ21haWwuY29tIiwidXNlcm5hbWUiOiJ0aGVpbnNhNTUiLCJpYXQiOjE3MDUyMTM4MjQsImV4cCI6MTcwNjA3NzgyNH0.od4IvpFyqP_pgnxIGMhuqji4soxB8DQMC1T2HdHmfWk';

        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
console.log(decodedToken);
        const user = await User.findById(decodedToken._id);

        console.log(user);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token v1");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid Refresh Token v2");
        }

        const options = {
            httponly: true,
            secure: true,
        };

        const { accessToken, newrefreshToken } = await generateAccessRefreshTokens(user._id);

        const apiResponse = new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "Access Token Refreshed");

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(apiResponse);

    } catch (error) {
        throw new ApiError(401, "Error in matching refresh token");
    }
});


export const changeCurrentPassword= asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}= req.body;
try {
        const user= await User.findById(req.user?._id);
       
        const validatePassword= await user.isPasswordCorrect(oldPassword);
        if (validatePassword){
            user.password= await newPassword;
            await user.save({validateBeforeSave: false});
            return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password Changed"));
        }
        else{
            throw new ApiError(404,"Your old password doesn't match.");
        }
} catch (error) {
    throw new ApiError(501, 'Error in changing the password');
}

})