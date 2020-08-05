const passport = require('../libs/passport')

module.exports.login = async function login(ctx, next) {
    await passport.authenticate('local', async (err, user, info) => {
        if (err) throw err
        if (!user) ctx.throw(401, info)

        const token = await ctx.login(user)

        ctx.body = { token }
    })(ctx, next)
}

