const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')
const sendMail = require('../libs/sendMail')

module.exports.register = async function register(ctx) {
    const { email, displayName, password } = ctx.request.body

    if (!email || !displayName || !password) ctx.throw(401, 'Fill all inputs')

    const userExists = await User.findOne({ email })

    if (userExists) ctx.throw(400, `User ${email} already exists`)

    const token = uuidv4()

    const user = await new User({
        email: email,
        displayName: displayName,
        verificationToken: token,
    })

        await user.setPassword(password)
        await user.save()
        await sendMail({
            to: user.email,
            subject: 'Confirm email',
            locals: { token: token },
            template: 'confirmation',
        })

    ctx.body = { status: 'ok' }
}

module.exports.confirm = async function confirm(ctx) {
    const receivedToken = ctx.params.token

    const user = await User.findOne({ verificationToken: receivedToken })

    if (!user) ctx.throw(400, 'Link outdated')

    await User.updateOne(
        { verificationToken: receivedToken },
        { $unset: { verificationToken: '' } })

    const token = uuidv4()

    ctx.body = { token: token }
}
