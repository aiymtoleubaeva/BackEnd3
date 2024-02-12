const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");

const dbURL = "mongodb+srv://aiym:aiymaiym@cluster0.ug3bscp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(dbURL);
client.connect();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = client.db("openWeather");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (!user || !bcrypt.compare(password, user.password)) {
      res.status(400).send('invalid credentials');
      return;
    }
    req.session.name = username;

    if (user.isAdmin) {
      res.redirect("/admin");
      return
    } else {
      res.redirect("/");
      return
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
