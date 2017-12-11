import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function extractIdFromUrl(url) {
  const regex = /\b(\w*)\.html/g;
  var m;
  while ((m = regex.exec(url)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    if (m.length > 1) {
      return m[1]
    }
  }
}

class SearchField extends Component {
    constructor(props) {
    super(props);
    this.state = {value: ''};

    this.submitHandler = props.onSubmit
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.submitHandler(this.state.value)
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Search products..." />
        </div>
      </form>
    );
  }
}

class Wishlist extends Component {
  render() {
    const removeFromWishlist = this.props.removeFromWishlist
    return (
      <div className="row">
        <div className="col-md-12">
          {this.props.items.length > 0 ? this.props.items.map(function(value, i) {
            return (
              <WishlistItem key={value.productId} product={value} onDeleteClick={removeFromWishlist} />
            )
          }) : (
            <div className="mr-auto ml-auto text-center">
                <p className="lead mt20">
                   Nothing here...<br />
                   Add some products to track your wish list
                </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

class WishlistItem extends Component {

  render() {
    const product = this.props.product
    const deleteHandler = this.props.onDeleteClick
    const onDeleteClick = function(e) {
      deleteHandler(product)
      e.preventDefault()
    }
    return (
      <div className="icon-card-style1 mb30">
        <i><img src={product.image} /></i>
        <a className="close" href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Remove" onClick={onDeleteClick}><i className="fa fa-times"></i></a>
        <div className="overflow-hiden">
          <h6>{product.subTitle}</h6>
          <h4 className="h6 font600">{product.suggestion}</h4>
        </div>
      </div>
    )
  }
}

class SearchResults extends Component {

  shouldUpdateComponent() { return true; }

  render() {
    const wishlistHandler = this.props.onAddToWishlist
    const wishedItems = this.props.wishedItems
    return (
      <div className="row">
        {this.props.items.length > 0 ? this.props.items.map(function(value, i) {
          const priceObj = JSON.parse(value.separatedSalePrice)
          const currency = priceObj.filter(obj => obj.isCurrency)[0].value
          const price = priceObj.filter(obj => !obj.isCurrency)[0].value
          const isOnWishlist = wishedItems.filter(obj => obj.productId === value.productId).length !== 0
          function handleClick(e) {
            wishlistHandler(value)
            e.preventDefault()
          }
          return (
            <div className="col-md-6 mb40" key={value.productId}>
              <div className="icon-card-style1">
                <i><img src={value.image} /></i>
                <div className="overflow-hiden">
                  <h6>{value.subTitle}</h6>
                  <h4 className="h6 font600">{value.suggestion}</h4>
                  <p className="mb20">{currency}{price}</p>
                  { !isOnWishlist ? (
                        <a href="#" className="btn btn-underline" onClick={ handleClick }>
                          Add to wishlist
                        </a>
                      ) : null
                  }
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="col-md-10 mr-auto ml-auto text-center">
              <p className="lead">
                 No results found
              </p>
          </div>
        )

      }
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryItems: [],
      wishedItems: [],
      wishlistid: localStorage.getItem('wishlistid')
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.addToWishlist = this.addToWishlist.bind(this);
    this.removeFromWishlist = this.removeFromWishlist.bind(this);

    this.search = this.search.bind(this);
    this.fetchSearch = this.fetchSearch.bind(this);

    this.refreshWishlist()
    this.fetchSearch(this.props.match.params.query ? this.props.match.params.query : "nmd" )
  }

  componentDidMount() {
    const wishlistId = this.state.wishlistid
    if (!wishlistId) {
      var randomNumber = Math.random().toString();
      randomNumber = randomNumber.substring(2, randomNumber.length);
      localStorage.setItem('wishlistid', randomNumber)
      console.log("New ID: " + randomNumber)
      this.setState({wishlistid: randomNumber})
    }
  }

  refreshWishlist() {
    fetch('/api/wishlist/' + this.state.wishlistid)
      .then(data => data.json())
      .then(parsedData => {
        this.setState({wishedItems: parsedData})
      })
  }

  fetchSearch(query) {
    fetch('https://www.adidas.co.uk/api/suggestions/' + query)
    .then(data => { return  data.json() })
    .then(finalData => {
        this.onSearchChange(finalData.products.map( (product) => {
          return Object.assign(product, {productId: extractIdFromUrl(product.url)} )
        }))
    })
  }

  search(query) {
    this.props.history.push('/' + query);
    this.fetchSearch(query)
  }

  onSearchChange(items) {
    this.setState({queryItems: items})
  }

  addToWishlist(product) {
    const productId = product.productId
    const hasItem = this.state.wishedItems.filter( (o) => o.productId === product.productId ).length > 0
    console.log("WishlistID: " + this.state.wishlistid)
    if (!hasItem) {
      fetch('/api/wishlist/' + this.state.wishlistid + "/article", {method: 'POST',
          body: JSON.stringify(product),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(parsedData => {
          this.refreshWishlist()
        })
    }
  }

  removeFromWishlist(product) {
    const productId = product.productId
    fetch('/api/wishlist/' + this.state.wishlistid + "/article/" + productId,
      {method: 'DELETE'})
      .then(parsedData => {
        this.refreshWishlist()
      })
  }

  render() {
    return (
      <div className="container pt90 pb50">
        <div className="row">
          <div className="col-md-8 mb40">
            <div className="row mb50">
                <div className="col-md-10 mr-auto ml-auto text-center">
                    <p className="lead">
                       Get started by typing something on the search field below
                    </p>

                    <SearchField onSubmit={this.search} />
                </div>
            </div>
            <div className="App-intro">
              <SearchResults items={this.state.queryItems} wishedItems={this.state.wishedItems} onAddToWishlist={this.addToWishlist} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="widget">
                <h3 className="text-center">Wishlist</h3>
                <Wishlist items={this.state.wishedItems} removeFromWishlist={this.removeFromWishlist} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
