import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { getEvents } from "./api";

getEvents("123456").then(events => {
    console.log(events);
    ReactDOM.render(<App events={events} />, document.getElementById('root'));
    registerServiceWorker();
});
