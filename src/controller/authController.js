import { uploadFileToCouldinary } from "../utils/coulddinary.js";
import fs from "fs";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
// import e from "express";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  //checking empty fields
  //field? waiting for value
  if ([username, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const profile_photo_path = req.files["profile_photo"][0].path;
  const cover_photo_path = req.files["cover_photo"][0].path;

  try {
    //check if email or username already exists
    //findOne is pull data from db
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(409).json({ message: "Email or username is already exists." });
      throw new Error("Email or username is already exists.");
    }

    let profile_photo = "";
    let cover_photo = "";

    if (profile_photo_path && cover_photo_path) {
      profile_photo = await uploadFileToCouldinary(profile_photo_path);
      cover_photo = await uploadFileToCouldinary(cover_photo_path);
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      profile_photo,
      cover_photo,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refresh-token"
    );

    if (!createdUser) {
      return res.status(400).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ userInfo: createdUser, message: "Registration is success." });
  } catch (error) {
    console.log("Registration error:", error.message);

    fs.unlinkSync(profile_photo_path);
    fs.unlinkSync(cover_photo_path);
  }
};

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "No user found." });
    }

    const accessToken = await existingUser.generateAccessToken();
    const refreshToken = await existingUser.generateRefreshToken();

    existingUser.refresh_token = refreshToken;
    await existingUser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const loginController = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username && !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existingUser) {
    return res.status(404).json({ message: "No user found." });
  }

  const isPassMatch = await existingUser.isPasswordMatch(password);

  if (!isPassMatch) {
    return res.status(401, "Invaild Credentials.");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(existingUser._id);

  const loggedUser = await User.findById(existingUser._id).select(
    "-password -refresh_token"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ user: loggedUser, message: "Login success." });
};

export const generateRefreshToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    return res.status(401).json({ message: "no refresh token" });

  try {
    //this funtion wiil decode the token and return the payload

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    //this function check user exist with id
    const existingUser = await User.findById(decodedToken?._id);

    if (!existingUser)
      return res.status(404).json({ message: "user not found" });

    if (incomingRefreshToken !== existingUser.refresh_token)
      return res.status(401).json({ message: "Invaild refresh token." });

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(existingUser._id);
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Token updated" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "somethig went wrong" });
  }
};

export const logoutController = async (req, res) => {
  //destructe user from req.user and id from req.user._id
  const {
    user,
    user: { _id: id },
  } = req;

  if (!user || !id) {
    return res
      .status(400)
      .json({ message: "No found user in logout Controller" });
  }

  try {
    await User.findByIdAndUpdate(
      id,
      {
        $unset: {
          refresh_token: 1,
        },
      },
      {
        new: true,
      }
    );

    const existingUser = await User.findById(id);
    if (!existingUser)
      return res.status(404).json({ message: "No found user in MongoDb" });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: `${req.user.username} logout successfully.` });
  } catch (error) {
    console.log("Logout error :", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
