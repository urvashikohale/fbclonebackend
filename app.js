const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

//middleware
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//DB Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTION SUCCESS"))
  .catch((err) => console.log(err));

//middleware
//middleware should go before routes
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

//PORT
const port = process.env.PORT || 8000;

//Server
app.listen(port, () => {
  console.log(`app is runnning at ${port}`);
});
