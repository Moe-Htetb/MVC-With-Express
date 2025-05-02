import { uploadFileToCouldinary } from "../utils/coulddinary.js";
import fs from "fs";
import { User } from "../models/user.js";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const profile_photo_path = req.files["profile_photo"][0].path;
  const cover_photo_path = req.files["cover_photo"][0].path;

  try {
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
      "-password -refreshToken"
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
