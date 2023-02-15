const express = require("express")
const router = express.Router()

// utils
const ExpressError = require("../utils/ExpressError")
const CatchAsync = require("../utils/CatchAsync")

// db models
const Campground = require("../models/campground")

// validation
const {campgroundSchema} = require("../schemas")
const validateCampground = (req, res, next) => {

    // validating data and catching errors
    const result = campgroundSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


// routes
router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({})
    
    res.render("campgrounds/index", {campgrounds})
})

router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

router.get("/:id/show", CatchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate("reviews")

    if (!campground) {
        req.flash("error", "Cannot Find That Campground")
        return res.redirect("/campgrounds")
    }

    res.render("campgrounds/show", {campground})
}))

router.get("/:id/edit", CatchAsync(async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    
    if (!campground) {
        req.flash("error", "Cannot Find That Campground To Edit")
        return res.redirect("/campgrounds")
    }

    res.render("campgrounds/edit", {campground})
}))

router.post("/", validateCampground, CatchAsync(async (req, res) => {
    const campground = new Campground(req.body)
    await campground.save()
    req.flash("success", "Successfully Made New Campground")
    res.redirect(`/campgrounds/${campground._id}/show`)
}))

router.put("/:id", validateCampground, CatchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body)
    req.flash("success", "Successfully Updated Campground")
    res.redirect(`/campgrounds/${campground._id}/show`) 
}))

router.delete("/:id", CatchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully Deleted Review")
    res.redirect("/campgrounds")
}))


module.exports = router