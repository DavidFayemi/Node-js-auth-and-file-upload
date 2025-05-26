import mongoose from "mongoose";
import { uploadToCloudinary } from "../helpers/cloudinaryHelpers.js";
import Image from "../models/Image.js";
import fs from "node:fs";
import cloudinary from "../config/cloudinary.js";
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: `File is required`,
      });
    }
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const imageToBeUploaded = {
      url: url,
      publicId: publicId,
      uploadedBy: req.userInfo.userId,
    };
    const uploadedImage = await Image.create(imageToBeUploaded);
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: `Image uploaded successfully`,
      image: imageToBeUploaded,
    });
  } catch (err) {
    console.warn(`An error occured while uploading the image: ${err.message}`);
    res.status(500).json({
      success: false,
      message: `An error occured while uploading the image: ${err.message}`,
    });
  }
};
const fetchImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;
    const images = await Image.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        message: `Images fetched successfully`,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (err) {
    console.warn(`An error occured while fetching the images: ${err.message}`);
    res.status(500).json({
      success: false,
      message: `An error occured while fetching the images: ${err.message}`,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getCurrentImageIdToDelete = req.params.id;
    const userId = req.userInfo.userId;
    const image = await Image.findById(getCurrentImageIdToDelete);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image Not Found",
      });
    }
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    // Delete from db
    await Image.findByIdAndDelete(getCurrentImageIdToDelete);
    res.status(200).json({
      success: true,
      message: `Image deleted successfully`,
    });
  } catch (err) {
    console.warn(`An error occured while deleting the image: ${err}`);
    res.status(500).json({
      success: false,
      message: `An error occured while deleting the image: ${err.message}`,
    });
  }
};
export { uploadImage, fetchImages, deleteImage };
