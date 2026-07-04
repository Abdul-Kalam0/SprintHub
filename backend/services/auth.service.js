import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  if (!name || !email || !password) {
    const error = new Error("Name, Email & Password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exist");
    error.statusCode = 409;
    throw error;
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  // 1. Validate Input
  if (!email || !password) {
    const error = new Error("Email and Password are required");
    error.statusCode = 400;
    throw error;
  }

  // 2. Find User
  const user = await UserModel.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Check Login Provider
  if (user.provider !== "local") {
    const error = new Error("Please sign in with Google");
    error.statusCode = 400;
    throw error;
  }

  // 4. Compare Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 5. Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 6. Save Refresh Token
  user.refreshToken = refreshToken;
  await user.save();

  // 7. Return Safe Data
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token not found");
    error.statusCode = 401;
    throw error;
  }

  const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_EXPIRY);

  const user = await UserModel.findByIdAndUpdate(jwtPayload.id, {
    refreshToken: null,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
};
