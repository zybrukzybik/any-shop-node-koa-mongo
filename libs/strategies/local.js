const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/User')

module.exports = new LocalStrategy(
    {
        session: false,
        usernameField: 'email',
    },

    async function(email, password, done) {
        const user = await User.findOne({ email })

        if (!user) return done(null, false, `No user with email: ${email}`)
        if (user.verificationToken) return done(null, false, 'Please confirm email.')

        const isValidPassword = await user.checkPassword(password)

        if (!isValidPassword) return done(null, false, 'Wrong password')

        done(null, user)
    },
)
