module.exports = function mustBeAuthenticated(ctx, next) {
    if (!ctx.user) ctx.throw(401, 'User not authenticated')
    
    return next()
}