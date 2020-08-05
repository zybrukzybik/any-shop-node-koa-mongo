const passport = require('../libs/passport')

module.exports.oauth = async function oath(ctx, next) {
    const provider = ctx.params.provider

    await passport.authenticate(provider, { scope: ['user:email'] })(ctx, next)
    }

module.exports.oauth_callback = async function oauth_callback(ctx, next) {
    const provider = ctx.request.body.provider

    await passport.authenticate(provider, async(err, user, info) => {
        if(err) throw err

        if(!user) {
            ctx.status = 400
            ctx.body = { error: info }

            return
        }

        const token = ctx.login(user)

        ctx.body = { token }
    })(ctx, next)
}
