import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { getEvents } from './api';

getEvents('129d53fa-cb77-4850-9a76-42d9cee1f523').then(calendar => {
  console.log(calendar);
  ReactDOM.render(<App calendar={calendar} />, document.getElementById('root'));
  registerServiceWorker();
});
