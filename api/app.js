const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express()

const wishlists = require('./wishlist.js')

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/wishlist', (req, res) => {
  const wishlistid = getOrCreateWishlistid(req, res)
  if (wishlistid != undefined) {
    res.json(Object.values(wishlists.getWishlist(req.cookies.wishlistid)))
  }
})

app.post('/api/wishlist', (req, res) => {
  const wishlistid = getOrCreateWishlistid(req, res)
  const product = req.body
  if (wishlistid != undefined && product != undefined && product.productId != undefined) {
    wishlists.addToWishlist(wishlistid, product)
    res.status(200).send()
  } else {
    res.status(500).send("Invalid Content")
  }
})

app.delete('/api/wishlist/:productId', (req, res) => {
  const wishlistid = getOrCreateWishlistid(req, res)
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

function getOrCreateWishlistid(req, res) {
  var wishlistId = req.cookies.wishlistid
  if (wishlistId == undefined) {
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie('wishlistid', randomNumber, { maxAge: 900000, httpOnly: true });
    wishlistId = randomNumber
    console.log("New ID: " + wishlistId)
  }
  return wishlistId
}

// Main page
app.use('/', (req, res) => {
  getOrCreateWishlistid(req, res)
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app
