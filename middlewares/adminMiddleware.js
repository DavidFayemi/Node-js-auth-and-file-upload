const verifyAdmin = (req, res, next) => {
  // check if the user is an admin or not
  if (req.userInfo.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access Denied. User is not an admin",
    });
  }

  next();
};
export default verifyAdmin;
