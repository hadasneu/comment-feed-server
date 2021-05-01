const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const commentsRoute = require("./routes/comments");
require("dotenv/config");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/comments", commentsRoute);

// Connect DB
mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to DB")
);

// Start listening to the server
const port = process.env.PORT;
app.listen(port, () =>
  console.log("Webserver listening to port", port)
);
