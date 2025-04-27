import express, { json, static as static_ } from "express";
import cors from "cors";
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

app.use(static_("public"));
export { app };
