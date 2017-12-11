const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const app = express()

const wishlists = require('./wishlist.js')

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/wishlist/:wishlistid', (req, res) => {
  const wishlistid = req.params.wishlistid
  if (wishlistid != undefined) {
    res.json(Object.values(wishlists.getWishlist(wishlistid)))
  }
})

app.post('/api/wishlist/:wishlistid/article', (req, res) => {
  const wishlistid = req.params.wishlistid
  const product = req.body
  if (wishlistid != undefined && product != undefined && product.productId != undefined) {
    wishlists.addToWishlist(wishlistid, product)
    res.status(200).send()
  } else {
    res.status(500).send("Invalid Content")
  }
})

app.delete('/api/wishlist/:wishlistid/article/:productId', (req, res) => {
  const wishlistid = req.params.wishlistid
  const productId = req.params.productId
  if (productId == undefined) {
    res.status(400).send()
  } else {
    wishlists.removeFromWishlist(wishlistid, productId)
    res.status(200).send()
  }
})

app.get('/api/*', function(req, res){
  res.status(404).send("what???")
});

// Main page
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app
