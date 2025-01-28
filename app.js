const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");

const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/hotels";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err)
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("running");
});
// all listings
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
});
// new route for creating
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs");
});
// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});
// create route with post
app.post("/listings", wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

// update : Edit & Update Route
//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});
// const wrapAsync = require("./utils/wrapAsync.js");
// update
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
})

// delete route

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing",async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calagute, goa",
//         country: "india",
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("success");
// })



// new middleware
// app.use((err, req, res, next) => {
//     res.send("something went wrong")
// })
app.listen(8080, () => {
    console.log("server is listening to port 8080");
})
