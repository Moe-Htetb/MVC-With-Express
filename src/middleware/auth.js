import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
export const varifyToken = async (req, res, next) => {
  const incomingToken = req.cookies.accessToken || req.header("authorization");

  if (!incomingToken)
    return res.status(401).json({ message: "No Incoming Token" });

  try {
    const decodedToken = jwt.decode(incomingToken);

    if (!decodedToken._id) {
      return res.status(401).json({ message: "No Incoming Token to decode" });
    }
    const existingUser = await User.findById(decodedToken._id).select(
      "-password -refresh-token"
    );

    if (!existingUser)
      return res.status(404).json({ message: "No User Found" });
    req.user = existingUser;
  } catch (error) {
    console.log(" auth middleware error: " + error);
  }

  next();
};
