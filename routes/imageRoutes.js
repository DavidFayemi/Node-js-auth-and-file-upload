import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import verifyAdmin from "../middlewares/adminMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import {
  fetchImages,
  uploadImage,
  deleteImage,
} from "../controllers/imageController.js";

const router = express.Router();

// Add routes
router.post(
  "/upload",
  authMiddleware,
  verifyAdmin,
  uploadMiddleware.single("image"),
  uploadImage
);
router.get("/", authMiddleware, fetchImages);

router.delete("/delete/:id", authMiddleware, verifyAdmin, deleteImage);
export default router;
