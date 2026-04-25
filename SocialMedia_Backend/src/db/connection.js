import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
    console.log(
      `MongoDB Connected !!! DB HOST:${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("Error in connecting database", error);
    process.exit(1);
  }
};
export default connection;