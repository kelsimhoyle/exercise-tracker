const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
});


// Routes
require("./routes/apiRoutes.js")(app);

mongoose.connect(MONGO_URI, { useNewUrlParser: true }, () => {
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
});
