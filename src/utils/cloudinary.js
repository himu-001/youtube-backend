import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been sucessfully uploaded
        console.log("File is uploaded on cloudinary","URL:- " ,response.url, '\n',"Secure URL:-", response.secure_url);
        return response;

    } catch (error) {
        //remove the locally saved temp file as upload operation failed
        return null;
    } finally {
         if (localFilePath && fs.existsSync(localFilePath)) {
           fs.unlinkSync(localFilePath);
         }
    }
}

export { uploadOnCloudinary };