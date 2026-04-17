import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import { app } from "./app.js";
import { createServer } from "node:http";
dotenv.config({
  path: "./.env",
});

const server = createServer(app);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server Connected At Port ${process.env.PORT || 8001}`);
    });
  })
  .catch((err) => {
    console.log("Error Found While Connecting to MongoDB", err);
  });
