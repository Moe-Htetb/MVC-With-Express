import mongoose from "mongoose";
const DB_Name = "MVC_Express";

export const connectDB = async () => {
  try {
    const connectionResponse = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_Name} `
    );
    console.log(
      `DB connect is succcessfully ${connectionResponse.connection.host}`
    );
  } catch (error) {
    console.log(`DB connnection error is ${error}`);
    process.exit(1);
  }
};
