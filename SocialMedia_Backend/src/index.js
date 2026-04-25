import app from "./app.js";
import connection from "./db/connection.js";
import dotenv from "dotenv"
const port = process.env.PORT || 8000;
connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected successfully at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
