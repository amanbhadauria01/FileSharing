



const express = require("express");
const DB = require("./config/db");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();
DB();

// const corsOptions = {
//   origin: process.env.ALLOWED_CLIENTS.split(","),
// };

// app.use(cors(corsOptions));

//template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static("public"));

// routes
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    console.log("Passed 1");
    next();
});

app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use("/api/files", require("./routes/files"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});