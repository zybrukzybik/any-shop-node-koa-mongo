const Order = require('../models/Order')
const Product = require('../models/Product')
const productMapper = require('../mappers/productMapper')
const orderMapper = require('../mappers/orderMapper')
const sendMail = require('../libs/sendMail')

module.exports.checkout = async function checkout(ctx) {
    const authorizeUser = ctx.user

    const { product, phone, address } = ctx.request.body

    const productById = await Product.findById(product)

    const order = await Order.create({
        user: authorizeUser,
        product: productById,
        phone,
        address,
    })
    const productMap = productMapper(order.product)

    await sendMail({
        template: 'order-confirmation',
        locals: { product: { title: productMap.title }, id: order['_id'] },
        to: authorizeUser.email,
        subject: 'Order confirmation',
    })

    ctx.body = { order: order['_id'] }
}

module.exports.getOrdersList = async function getOrdersList(ctx) {
    const user = ctx.user
    const orders = await Order.find({ user }).populate('product')

    ctx.body = { orders: orders.map(orderMapper) }
}
