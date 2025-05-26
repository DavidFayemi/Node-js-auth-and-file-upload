import express from "express";

// import all controllers
import {
  registerUser,
  login,
  changePassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const routes = express.Router();

// Add routes
routes.post("/sign-up", registerUser);
routes.post("/login", login);
routes.post("/change-password", authMiddleware, changePassword);

export default routes;
