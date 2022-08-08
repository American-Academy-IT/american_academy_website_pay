//Dependencies
var compression = require("compression");
var express = require("express");
var bp = require("body-parser");
var dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
var session = require("express-session");
var http = require("http");
// const path = require("path");
var SecureController = require("./controllers/3DSecure");
var indexController = require("./controllers/index");
// const { createTables } = require("./configration/config");
// const usersRoutes = require("./modules/PayModule/pay.route.js");
var appPortNo = "5000";


//Express
var app = express();

app.use(express.json());
app.use(cors());
// createTables();
// app.use("/api/pay", usersRoutes);

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(function (request, response, next) {
  request.session.cookie = {};
  next();
});
// compress all requests
app.use(compression());
app.use(
  bp.urlencoded({
    extended: true,
  }),
);
app.use(bp.json());
if (!process.env.PORT) {
  process.env.PORT = appPortNo;
}
app.set("port", process.env.PORT);
//Routes
app.use("/", indexController);
app.use("/process", SecureController);

app.use(express.static(__dirname + "/public"));
// views is directory for all template files
app.set("views", __dirname + "/public");
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.get("/", function (request, response, next) {
  response.redirect("/");
});

// app.get("/*", function (_req, res) {
//   res.sendFile(
//     path.join(__dirname, "..", "public", "index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     },
//   );
// });

http.createServer(app).listen(app.get("port"), function () {
  console.log("gateway NodeJS sample code running on port", app.get("port"));
});
