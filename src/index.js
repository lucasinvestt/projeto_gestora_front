import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import { getRoutes } from './route';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

ReactDOM.render(
  <React.StrictMode>
    {getRoutes()}
  </React.StrictMode>,
  document.getElementById('root')
);
