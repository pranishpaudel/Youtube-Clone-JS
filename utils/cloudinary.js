import cloudinary from 'cloudinary';
import fs from 'fs';


          
cloudinary.v2.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_SECRET_KEY}`,
    secure: true,
  });

export const uploadOnCloudinary= async(localFilePath)=> {
    try{
        if (!localFilePath) return null
        //upload the file on cloudinary
       const response= await   cloudinary.v2.uploader.upload(localFilePath,{
            resource_type: 'auto'
        });
        fs.unlinkSync(localFilePath);
        return response
        //file has been uploaded successfully
    }
catch(error){
fs.unlinkSync(localFilePath);
console.log("Some error")
return null;
}}

