const app = require("./server");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const filesRouter = require("./routes/files.js");
const usersRouter = require("./routes/users.js");
const db = require("./database/db.js");
const authMiddleware = require("./middlewares/authMiddleware");
const User = require("./models/User");
const adminRouter = require("./routes/admin.js");
const folderRouter = require("./routes/folders.js");
const Folder = require("./models/Folder");

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB connection - success");
});

//- Disable default settings
app.disable("x-powered-by");

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
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/folders", folderRouter);

//* TEST
app.get("/test", async (req, res) => {});

//? Catch undefined path - url
app.use((req, res) => {
    res.status(404).send({ status: false, message: "404 - Not found!" });
});
