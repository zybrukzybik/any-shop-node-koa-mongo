const mongoose = require('mongoose')
const connection = require('../libs/connection')

const subcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
})

const categorySchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
    },
    subcategories: [subcategorySchema],
})

module.exports = connection.model('Category', categorySchema)
