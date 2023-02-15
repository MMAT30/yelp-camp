const express = require("express")
const router = express.Router({mergeParams: true})

// utils
const ExpressError = require("../utils/ExpressError")
const CatchAsync = require("../utils/CatchAsync")

// db models
const Campground = require("../models/campground")
const Review = require("../models/review")


// validation
const {reviewSchema} = require("../schemas")
const validateReview = (req, res, next) => {

    // validating data and catching errors
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        const msg = result.error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


router.post("/", validateReview, CatchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "Created New Review")
    res.redirect(`/campgrounds/${campground._id}/show`)
}))

router.delete("/:reviewId", CatchAsync( async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findOneAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully Deleted Review")
    res.redirect(`/campgrounds/${id}/show`) 
}))

module.exports = router