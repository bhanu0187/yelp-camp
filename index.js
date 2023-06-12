const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const campgroundSchema = require("./Schemas");

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const errorMessage = error.details.map((e) => e.message).join(",");
		throw new ExpressError(errorMessage, 400);
	} else {
		next();
	}
};

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
	console.log("Databse connected");
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	const { id } = req.params;
	res.render("campground/index", { campgrounds, id });
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campground/new");
});

app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			next(new ExpressError("Could not find this page", 404));
		}
		res.render("campground/detail", { id, campground });
	})
);

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		res.render("campground/edit", { id, campground });
	})
);

app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 400));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) {
		err.message = "Oh! Something went wrong.";
	}
	res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("Listining to port 3000");
});
