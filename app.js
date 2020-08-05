const Koa = require('koa')
const koaRouter = require('koa-router')
const koaParser = require('koa-parser')
const categoriesList = require('./controllers/categoriesList')
const findProductBySubcategory = require('./controllers/findProduct').findProductBySubcategory
const productList = require('./controllers/findProduct').productList
const findProductByQuery = require('./controllers/findProduct').findProductByQuery
const findProductById = require('./controllers/findProduct').findProductById
const recommendations = require('./controllers/recommendations')
const login = require('./controllers/login').login
const register = require('./controllers/register').register
const confirm = require('./controllers/register').confirm
const serve = require('koa-static')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Session = require('./models/Session')
const mustBeAuthenticated = require('./libs/mustBeAuthenticated')
const me = require('./controllers/me')
const { oauth, oauth_callback } = require('./controllers/oauth')
const { checkout, getOrdersList } = require('./controllers/orders')
const fs = require('fs')
const app = new Koa()
const messageList = require('./controllers/messageList')

app.use(koaParser())
app.use(serve(path.join(__dirname, 'public')))
//Errors handler middleware
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.log(err)
        ctx.body = 'Shit happened:' + '\n\n' + err
    }
})

app.use((ctx, next) => {
    ctx.login = async function (user) {
        const token = uuidv4()

        await new Session({
            token,
            user,
            lastVisit: Date.now(),
        })
            .save()

        return token
    }

    return next()
})

const router = new koaRouter({ prefix: '/api' })

//Token check
router.use(async (ctx, next) => {
    const header = ctx.request.get('Authorization')

    if (!header) return next()

    const token = header.split(' ')[1]

    if (!token) return next()

    const session = await Session.findOne({ token }).populate('user')

    if (!session) ctx.throw(401, 'Wrong authentication code.')

    session.lastVisit = new Date()
    await session.save()

    ctx.user = session.user

    return next()
})

router.get('/recommendations', recommendations)
router.get('/categories', categoriesList)
router.get('/products', findProductBySubcategory, findProductByQuery, productList)
router.get('/products/:id', findProductById)

router.post('/login', login)

router.get('/oauth/:provider', oauth)
router.post('/oauth/callback/:strategy', oauth_callback)

router.get('/me', mustBeAuthenticated, me)

router.post('/register', register)
router.post('/confirm/:token', confirm)

router.get('/orders', mustBeAuthenticated, getOrdersList)
router.post('/orders', mustBeAuthenticated, checkout)

router.get('/messages', messageList)

app.use(router.routes())

// this for HTML5 history in browser
const index = fs.readFileSync(path.join(__dirname, 'public/index.html'))

app.use(ctx => {
    if (!ctx.url.startsWith('/api')) {
        ctx.set('content-type', 'text/html')
        ctx.body = index
    }
})

module.exports = app

