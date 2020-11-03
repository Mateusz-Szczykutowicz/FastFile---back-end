const app = require("./server");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const filesRouter = require("./routes/files.js");
const db = require("./database/db.js");

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DB connection - success");
});

//- Middleware - dev
app.use(morgan("dev"));

//- Middleware - production
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//- Routes
app.use("/api/v1/files", filesRouter);
