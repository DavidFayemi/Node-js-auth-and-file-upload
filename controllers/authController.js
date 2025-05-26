import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message: "This user already exists",
      });
    } else {
      const passwordSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, passwordSalt);
      const newUser = User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: role || "user",
      });
      if (newUser) {
        res.status(200).json({
          success: true,
          message: "Account created Successfully...",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Sorry, unable to register user...",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `An Error occured while trying to register user: ${err.message}`,
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `An Error occured while trying to login: ${err.message}`,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    // get old and new password
    const { oldPassword, newPassword } = req.body;
    // get current user
    const currentUser = await User.findOne({ _id: userId });
    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: `User Not Found`,
      });
    } else {
      // check if old password is correct
      const doesPasswordMatch = await bcrypt.compare(
        oldPassword,
        currentUser.password
      );
      if (!doesPasswordMatch) {
        res.status(400).json({
          success: false,
          message: `Old Password isn't correct`,
        });
      } else {
        // hash new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        // Update new password
        currentUser.password = newHashedPassword;
        await currentUser.save();
        res.status(200).json({
          success: true,
          message: `Password Changed Successfully`,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `An Error occured while trying to change password: ${err.message}`,
    });
  }
};
export { registerUser, login, changePassword };
