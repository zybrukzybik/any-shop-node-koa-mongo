module.exports = function messageMapper(message) {
    return {
        date: message.date,
        text: message.text,
        id: message['_id'],
        user: message.user,
    }
}
