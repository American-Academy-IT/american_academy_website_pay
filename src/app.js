const express = require("express");
const { join } = require("path");
const cors = require("cors");

const openSession = require("./services/checkout");
const generateId = require("./services/generateId");
const sendNotification = require("./services/mailer");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const { errMiddleware, errHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "..", "public")));
app.use(loggerMiddleware);

app.post(
  "/checkout",
  errHandler(async (req, res) => {
    const { amount, description } = req.body;
    if (!amount || !description) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    if (+amount < 100) {
      return res.status(400).send({ message: "Invalid amount" });
    }

    const sessionId = await openSession(amount, description);
    await sendNotification(req.body);
    return res.status(200).send({ sessionId });
  })
);

app.get("/*", (_, res) => {
  return res.sendFile(join(__dirname, "..", "public", "index.html"));
});

app.use(errMiddleware);

module.exports = app;
