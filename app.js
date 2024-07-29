const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.route("/").get((req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
