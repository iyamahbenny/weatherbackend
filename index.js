const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const WeatherUser = require("./model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://test:test@clutster.6ktkbx5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () => console.log("connected to db")
);

app.get("/", async (req, res) => {
  const allUsers = await WeatherUser.find();
  res.send(allUsers);
});

app.post("/login", async (req, res) => {
  const email = req.body.loginemail;
  const password = req.body.loginpassword;

  const checkUser = await WeatherUser.findOne({ email: email });

  if (!checkUser)
    return res.status(400).json({
      message: "User does not Exist",
    });

  if (checkUser.password === password) {
    res.status(200).json(checkUser.name);
  } else {
    return res.status(400).json({
      message: "password is incorrect",
    });
  }
});

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const checkUser = await WeatherUser.findOne({ email: email });

  if (checkUser)
    return res.status(400).json({
      message:
        "User Already Exists, Please use a different email or login to continue",
    });

  const user = new WeatherUser({
    name: name,
    email: email,
    password: password,
  });
  try {
    const savedUser = await user.save();
    res.status(200).json(savedUser.name);
  } catch (err) {
    res.status(400).json({
      message: "An error occurred, please try again to continue",
    });
  }
});
app.listen(5000, console.log("Server is running"));
