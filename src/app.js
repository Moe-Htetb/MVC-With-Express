import express, { json, static as static_ } from "express";
import cors from "cors";
import router from "./routes/routes.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(
  json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(static_("public"));
app.use(cookieParser());
app.use("/test", router);
app.use("/api/v1/", authRouter);

export { app };
