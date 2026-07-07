import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      const error = new Error("Access token is required");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserModel.findById(decoded.id).select(
      "-password -refreshToken",
    );
    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
