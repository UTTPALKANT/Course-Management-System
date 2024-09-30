import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new AppError("Unauthenticated! Please login", 401));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    if (!userDetails) {
      return next(new AppError("Unauthorized, please login to continue", 401));
    }

    req.user = userDetails;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("Invalid token:", error.message);
      return next(new AppError("Invalid token", 401));
    } else if (error.name === "TokenExpiredError") {
      console.error("Token has expired:", error.message);
      return next(new AppError("Token has expired", 401));
    } else {
      console.error("Authentication error:", error.message);
      return next(new AppError("Authentication failed", 401));
    }
  }
};
const authorizeRoles =
  (...roles) =>
  async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }

    next();
  };
// code ekdam correct hai
const authorizeSubscribers = async (req, _res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "ADMIN" && user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route.", 403));
  }

  next();
};

export { isLoggedIn, authorizeRoles, authorizeSubscribers };
