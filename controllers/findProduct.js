const Product = require('../models/Product')
const mapProduct = require('../mappers/productMapper')
const mongoose = require('mongoose')

module.exports.findProductBySubcategory = async function findProductBySubcategory(ctx, next) {
    const { subcategory } = ctx.query

    if (!subcategory) return next()

    const foundProduct = await Product.find({ subcategory: subcategory })

    ctx.body = { products: foundProduct.map(mapProduct) }
}

module.exports.findProductByQuery = async function findProductByQuery(ctx, next) {
    const { query } = ctx.query

    if (!query) return next()

    const foundProduct = await Product
        .find({ $text: { $search: query } }, { $score: { $meta: 'textScore' } })
        .limit(20)

    ctx.body = { products: foundProduct.map(mapProduct) }
}

module.exports.productList = async function productList(ctx) {
    const products = await Product.find().limit(20)

    ctx.body = products.map(mapProduct)
}

module.exports.findProductById = async function findProductById(ctx) {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw(401, 'Invalid ID')
    }

    const foundProduct = await Product.findById(ctx.params.id)

    if (!foundProduct) ctx.throw(401, `Product with id: ${ctx.params.id} not found in DB`)

    ctx.body = { product: mapProduct(foundProduct) }
}
