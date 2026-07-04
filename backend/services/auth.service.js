import UserModel from "../models/User.js";

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
  if (!email || !password) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 404;
    throw error;
  }
};
