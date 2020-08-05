module.exports = function mapOrder(order) {
    return {
        id: order._id,
        user: order.user,
        product: order.product.map(product => ({
            id: product._id,
            title: product.title,
            images: product.images,
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            description: product.description,
        })),
        phone: order.phone,
        address: order.address,
    }
}
