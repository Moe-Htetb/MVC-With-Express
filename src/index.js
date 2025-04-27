import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";

dotenv.config({
  path: ".env",
});
const PORT = process.env.PORT || 8000;
// console.log(process.env);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` server is running at ${PORT}`);
    });
  })
  .catch((err) => console.log("DB connection err is" + err));
