import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  const { username, userId, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to the Home Page",
    user: {
      _id: userId,
      username: username,
      role: role,
    },
  });
});

export default router;
