const User = require('../../models/User')

module.exports = async function authenticate(strategy, email, displayName, done) {
    if (!email) return done(null, false, 'No email received')
    
    try {
        const user = await User.findOne({ email, displayName })
        
        if (!user) {
            const newUser = await new User(user).save()

            return done(null, newUser)
        }

    return done(null, user)
    } catch (error) {
        done(error)
    }
}
