import { loginUser, registerUser } from "../services/auth.service.js";
import UserModel from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    await logoutUser(req.cookies.refreshToken)

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
        success:true,
        message:"Logout successful"
    })
    
  } catch (error) {
    next(error)
  }
};
export const googleLogin = () => {};

export const refreshAccessToken = () => {};
export const getCurrentUser = () => {};
