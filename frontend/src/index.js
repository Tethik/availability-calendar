// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Auth/Auth';

import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

ReactDOM.render(routes, document.getElementById('root'));
// registerServiceWorker();
