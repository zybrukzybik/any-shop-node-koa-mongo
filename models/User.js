const mongoose = require('mongoose')
const connection = require('../libs/connection')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: 'Email cant be empty.',
        validate: [
            {
                validator(value) {
                    return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value)
                },
                message: 'Not valid email.',
            },
        ],
        unique: 'Such email already exists.',
    },

    displayName: {
        type: String,
        required: 'User must have Nickname.',
        unique: 'Such Nickname already exists.',
    },

    passwordHash: {
        type: String,
    },

    salt: {
        type: String,
    },

    verificationToken: {
        type: String,
    },
}, {
    timestamps: true,
})

function generatePassword(salt, password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password, salt,
            1,
            128,
            'sha512',
            (err, key) => {
                if (err) return reject(err)
                resolve(key.toString('hex'))
            },
        )
    })
}

function generateSalt() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(128, (err, buffer) => {
            if (err) return reject(err)
            resolve(buffer.toString('hex'))
        })
    })
}

userSchema.methods.setPassword = async function setPassword(password) {
    this.salt = await generateSalt()
    this.passwordHash = await generatePassword(this.salt, password)
}

userSchema.methods.checkPassword = async function (password) {
    if (!password) return false

    const hash = await generatePassword(this.salt, password)

    return hash === this.passwordHash
}

module.exports = connection.model('User', userSchema)

