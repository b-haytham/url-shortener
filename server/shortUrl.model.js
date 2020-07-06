const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
})



const ShortUrl = mongoose.model('Url', shortUrlSchema)

module.exports = ShortUrl