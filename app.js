const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongooseEncrytion = require("mongoose-encryption");

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

const secret = "thidashdidiahdasdfghntnmuyy.";
userSchema.plugin(mongooseEncrytion, {
  secret: secret,
  encryptedFields: ["password"],
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
    const user = new User({
      email: email,
      password: password,
    });
    const result = await user.save();
    if (result) {
      res.render("secrets");
    } else console.log("Error!");
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
      if (result.password === password) {
        res.render("secrets");
      } else res.send("Incorrect Password");
    } else res.send("User do not exists in the database!");
  });

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
