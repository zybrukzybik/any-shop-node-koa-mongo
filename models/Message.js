const mongoose = require('mongoose')
const connection = require('../libs/connection')

const messageSchema = new mongoose.Schema ({

    user: {
        type: String,
        required: true,
    },

    chat: {
        type: String,
    },

    text: {
        type: String,
    },

    date: {
        type: Date,
    },
})

module.exports = connection.model('Message', messageSchema)
