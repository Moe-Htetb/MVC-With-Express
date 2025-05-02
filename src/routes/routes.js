import { Router } from "express";
import { controller } from "../controller/controller.js";

const router = Router();

router.get("/", controller);

export default router;
