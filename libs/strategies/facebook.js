const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../../config')
const get = require('lodash/get')
const authenticate = require('./authenticate')

module.exports = new FacebookStrategy({
        clientID: '574252066786347',
        clientSecret: '6bb7941163e8787b507bac62139a98fc',
        callbackURL: 'http://localhost:3000/oauth/callback/facebook',
        profileFields: ['displayName', 'email'],
        session: false,
    }, function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile)

        authenticate('facebook', get(profile, 'emails[0].value'), profile.displayName, done)
    },
)
