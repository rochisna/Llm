const express = require("express");
const mongoDB = require("./db");
const createUserRoutes = require("./Routes/LoginSignup");

const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoDB();

app.use(express.json());

app.use("/api", createUserRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
