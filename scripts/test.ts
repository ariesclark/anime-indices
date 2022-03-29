import * as database from "../build/index.js"

database.find({ 
    status: "ongoing", 
    type: "tv", 
    tags: ["isekai"]
}).then((shows) => {
    console.log(shows.length)
})