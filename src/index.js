import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
// import Routes from './routes';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path='/about' component={App} />
      <Route path='/contact' component={App} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
