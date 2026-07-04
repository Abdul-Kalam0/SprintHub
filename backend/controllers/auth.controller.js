import { loginUser, registerUser } from "../services/auth.service.js";

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
export const login = (req, res, next) => {
  try {
    const user = loginUser(req.body);
    return res.status(200).json({
      success: false,
      message: "User loggedin successful",
    });
  } catch (error) {
    next(error);
  }
};
export const googleLogin = () => {};
export const logout = () => {};
export const refreshAccessToken = () => {};
export const getCurrentUser = () => {};
