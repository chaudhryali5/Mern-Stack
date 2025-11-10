import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) {
            return null
        }
        cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })
        console.log("file is upload on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localPath)
        return null
    }
}
export { uploadOnCloudinary }
