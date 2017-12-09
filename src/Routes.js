import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/search" component={App} />
  </Router>
);

export default Routes;
