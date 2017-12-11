
class Wishlist {
  constructor() {
    this.wishlists = {} // Sake of simplicity, we will use memory wishlist
  }

  addToWishlist(userId, product) {
    if (!this.wishlists.hasOwnProperty(userId)) {
        this.wishlists[userId] = {}
    }
    this.wishlists[userId][product.productId] = product
  }

  removeFromWishlist(userId, productId) {
    if (this.wishlists.hasOwnProperty(userId)) {
        delete this.wishlists[userId][productId]
    }
  }

  getWishlist(userId) {
    const wishlist = this.wishlists.hasOwnProperty(userId) ? this.wishlists[userId] : {}
    return wishlist
  }
}

module.exports = new Wishlist()
