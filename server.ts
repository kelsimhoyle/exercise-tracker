const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());


app.use(cors());
app.use(express.static("public"));
app.get("/", (req: Request, res: any) => {
  res.sendFile(__dirname + "/views/index.html")
});


// Routes
require("./routes/apiRoutes")(app);

mongoose.connect(MONGO_URI, { useNewUrlParser: true }, () => {
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
});
