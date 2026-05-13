import app from "./app.js";//server
import connection from "./db/connection.js";//db
import dotenv from "dotenv"//env
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
