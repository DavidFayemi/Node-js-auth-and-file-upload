import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied, No token provided. Login to continue",
    });
  }

  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Send the token info to routes using the middleware
    req.userInfo = decodedTokenInfo;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `An error occured :( => ${err.message}`,
    });
  }
};

export default authMiddleware;
