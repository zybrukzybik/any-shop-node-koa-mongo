const Category = require('../models/Category')
const mapCategory = require('../mappers/categoryMapper')

module.exports = async function categoriesList(ctx) {
    const foundCategories = await Category.find({})

    ctx.body = { categories: foundCategories.map(mapCategory) }
}
