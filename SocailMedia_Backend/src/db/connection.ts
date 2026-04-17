import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log("MONGODB_URI NOT FOUND IN THE ENV");
    }
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `MongoDB Connected Successfully at Host ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MongoDB Error", error);
    process.exit(1);
  }
};
export default connectDB;