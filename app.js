const express = require("express")
const app = express()
const PORT = 80
const path = require("path")
const methodOveride = require("method-override")
const flash = require("connect-flash")
const session = require("express-session")

// utils
const ExpressError = require("./utils/ExpressError")

// db
const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/yelp-camp")

// app settings
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOveride("_method"))
const sessionConfig = {
    secret: "password",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})







// HOME
app.get("/", (req, res) => {
    res.render("home")
})


// CAMPGROUND ROUTES
const routesCampground = require("./routes/campgrounds")
app.use("/campgrounds", routesCampground)


// REVIEW ROUTES
const routesReview = require("./routes/reviews")
app.use("/campgrounds/:id/reviews", routesReview)




// GENERAL ROUTES
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {status = 500} = err
    if (!err.message) {err.message = "Something Went Wrong!"}
    res.status(status).render("error", { err })
}) 

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})

module.exports = app