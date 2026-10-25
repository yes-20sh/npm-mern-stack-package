import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new Error("Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
