import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const signupService = async ({
  name,
  email,
  phone_number,
  password,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    phone_number,
  });
  if (!user) {
    throw new Error("Failed to create User");
  }
  return { message: "Successfully Signup" };
};

export const signInService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found, please sign up");
    error.statusCode = 401;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return { accessToken, refreshToken };
};
