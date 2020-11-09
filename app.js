const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const app = require("./server");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const filesRouter = require("./routes/files.js");
const usersRouter = require("./routes/users.js");
const db = require("./database/db.js");
const authMiddleware = require("./middlewares/authMiddleware");
const User = require("./models/User");

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
app.use("/api/v1/users", usersRouter);

app.get("/test", authMiddleware.checkToken, async (req, res) => {
  let token = req.headers.authorization.split(".");
  let signature = token[1];
  let user = await User.findOne({ signature });
  res.send({ test: "pomyślnie przeprowadzowno", user });
});
