const app = require('./app')
const socket = require('./socket')

const server = app.listen(process.env.PORT, () => {
    console.log('App running on http://localhost:3000')
})

socket(server)
