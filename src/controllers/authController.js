import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { createSession } from "../services/auth.js";
import { Session } from "../models/session.js";

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

export const logOut = async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }

  res.status(204).send();
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const session = await Session.findOne({
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    throw createHttpError(401, "Refresh token expired");
  }

  await session.deleteOne();
  const newSession = await createSession(session.userId);
  res.status(200).json({
    message: "Session refreshed",
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
  });
};
