import { Router } from "express";
import {
  generateRefreshToken,
  loginController,
  logoutController,
  registerController,
} from "../controller/authController.js";
import { upload } from "../middleware/multer_storage.js";
import { varifyToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  //multer middleware
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  registerController
);

router.post("/login", loginController);

router.post("/refresh", generateRefreshToken);

router.post("/logout", varifyToken, logoutController);

export default router;
