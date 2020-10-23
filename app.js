const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const path = require("path");
const morgan = require("morgan");

const app = require("./server");
const db = require("./DataBase/db");
const config = require("./config");

const page = require("./routes/page");
const api = require("./routes/api");
const auth = require("./routes/auth");

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DB connection - success");
});

//? Enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//? Other middleware
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// [tmp] View methode and path with status
app.use(morgan("dev"));

app.use(cookieParser());
app.use(
  session({
    name: "session",
    keys: config.keySession,

    //? Cookie Options
    maxAge: config.maxAgeSession,
  })
);

app.use("/", page);
app.use("/api", api);
app.use("/auth", auth);
