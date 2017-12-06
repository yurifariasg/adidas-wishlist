import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function searchAdidas(query, callback) {
    fetch('https://www.adidas.co.uk/api/suggestions/' + query)
    .then(data => { return  data.json() })
    .then(finalData => {
        if (callback) callback(finalData.products)
    })
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
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryItems: [],
      wishedItems: []
    }
  }

  search(q) {
    searchAdidas(q, console.log)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <SearchField onSubmit={this.search} />
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
