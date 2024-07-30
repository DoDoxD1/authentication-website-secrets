require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = mongoose.Schema({
  email: String,
  password: String,
});
const User = new mongoose.model("User", userSchema);

app.route("/").get((req, res) => {
  res.render("home");
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (!err) {
        const user = new User({
          email: email,
          password: hash,
        });
        const result = await user.save();
        if (result) {
          res.render("secrets");
        } else console.log("Error!");
      } else {
        console.log("Error!!!");
      }
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    const result = await User.findOne({ email: email });
    if (result) {
      bcrypt.compare(password, result.password, function (err, result) {
        if (result == true) {
          res.render("secrets");
        } else res.send("Incorrect Password");
      });
    } else res.send("User do not exists in the database!");
  });

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
