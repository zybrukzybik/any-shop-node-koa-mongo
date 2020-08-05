const Message = require('../models/Message')
const messageMapper = require('../mappers/messageMapper')

module.exports = async function messageList(ctx) {
    if(!ctx.user) ctx.throw(401, 'Not login')

    const messages = await Message.find({}).limit(50)

    ctx.body = { messages: messages.map(messageMapper) }
}
