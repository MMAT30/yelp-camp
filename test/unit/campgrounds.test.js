import { describe, expect, it} from "vitest"
import app from "../../app"
import request from "supertest"


// const mongoose = require('mongoose');
// const cities = require('./cities');
// const { places, descriptors } = require('./seedHelpers');
// const Campground = require('../models/Campground');

// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://localhost:27017/yelp-camp');

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("database connected");
// });


describe("GET /campgrounds", () => { 

    describe("on success", () => {

    
        it("should respond with a 200 status code", async () => {
            const res = await request(app).get("/campgrounds")
            expect(res.statusCode).toBe(200)
        })
    
        it("should specify html in the content-type header", async () => {
            const res = await request(app).get("/campgrounds")
            expect(res.header["content-type"]).toEqual(expect.stringContaining("text/html"))
        })

    })

    // describe("on failure", () => {
        
    // })

    
    
})