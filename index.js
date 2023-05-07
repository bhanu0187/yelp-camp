const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");

app.get("/", (req, res) => {
	res.render("home");
});

app.listen(3000, () => {
	console.log("Listining to port 3000");
});
