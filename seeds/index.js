const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");

mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
	console.log("Databse connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const randomCities = Math.floor(Math.random() * cities.length);
		const randomPrice = Math.floor(Math.random() * cities.length) + 10;
		const camp = new Campground({
			location: `${cities[randomCities].city}, ${cities[randomCities].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/483251",
			description:
				"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam porro magnam labore, molestiae sapiente similique voluptatem iusto. Quis nostrum inventore, eos obcaecati suscipit totam, expedita neque repellat corporis quidem incidunt odit itaque illum accusamus quos labore eveniet dolor eius atque?",
			price: randomPrice,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	"";
	mongoose.connection.close();
});
