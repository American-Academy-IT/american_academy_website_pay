const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>hi from server</h1>");
});

app.listen(PORT, () => {
  console.log("app run on port:" + PORT);
});
