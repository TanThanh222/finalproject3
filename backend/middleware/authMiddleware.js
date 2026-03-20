import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    token = token.replace(/^"|"$/g, "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.name, error.message);

    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  next();
};
