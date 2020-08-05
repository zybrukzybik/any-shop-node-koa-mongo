const mongoose = require('mongoose')
const connection = require('../libs/connection')

const sessionSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true,
        unique: true,
    },

    lastVisit: {
        type: Date,
        required: true,
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },

})

module.exports = connection.model('Session', sessionSchema)
