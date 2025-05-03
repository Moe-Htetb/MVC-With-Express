import { Router } from "express";
import {
  generateRefreshToken,
  loginController,
  registerController,
} from "../controller/authController.js";
import { upload } from "../middleware/multer_storage.js";
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

export default router;
