const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express()

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/search/:query', (req, res) => res.send(req.params['query']))

app.get('/api/*', function(req, res){
  res.send('what???', 404);
});

// Main page
app.get('/:query', (req, res) => {
  console.log("Frontend should query: " + req.query)
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


module.exports = app
