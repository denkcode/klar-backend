import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { createSession } from "../services/auth.js";

// Register User

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  // Hashed Password

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
  });
  const newSession = await createSession(user._id);
  res.status(201).json({
    user,
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid email or password");
  }

  const newSession = await createSession(user._id);
  res.status(200).json({
    user,
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
  });
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};
