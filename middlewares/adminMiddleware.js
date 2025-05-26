const verifyAdmin = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access Denied. User is not an admin",
    });
  }

  next();
};
export default verifyAdmin;
