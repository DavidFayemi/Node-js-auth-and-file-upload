import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.warn("An Error Occured while uploading to cloud: ", err);
    return {
      url: null,
      publicId: null,
    };
  }
};

export { uploadToCloudinary };
