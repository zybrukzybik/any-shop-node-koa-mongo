const socketIO = require('socket.io')

const Session = require('./models/Session')
const Message = require('./models/Message')

function socket(server) {
    const io = socketIO(server)

    io.use(async (socket, next) => {
        const queryToken = socket.handshake.query.token

        if(!queryToken) return next(new Error('Anonymous not allowed.'))

        const session = await Session.findOne({ token: queryToken }).populate('user')

        if (!session) return next(new Error('Wrong or expired session'))

        socket.user = session.user
        next()
    })

    io.on('connection', function(socket) {
        console.log('Connected')
        socket.on('message', async msg => {
            console.log(msg)
            const answer = await Message.create({
                user: socket.user.displayName,
                chat: socket.user['_id'],
                text: msg,
                date: Date.now(),
            })

            socket.broadcast.emit('message', answer)
        })
    })

    return io
}

module.exports = socket
