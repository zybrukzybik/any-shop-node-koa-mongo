const Product = require('../models/Product')
const mapProduct = require('../mappers/productMapper')

module.exports = async function recommendationList(ctx) {
    const recommendations = await Product.find().limit(6)

    ctx.body = { recommendations: recommendations.map(mapProduct) }
}
