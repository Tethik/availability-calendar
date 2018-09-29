import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { getEvents } from './api';
import Callback from './Callback/Callback';
import Home from './Home/Home';
import Profile from './Profile/Profile';

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login = () => {
    this.props.auth.login();
  };

  logout = () => {
    this.props.auth.logout();
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goTo.bind(this, 'home')}
            >
              Home
            </Button>
            {!isAuthenticated() && (
              <Button
                bsStyle="primary"
                className="btn-margin"
                onClick={this.login.bind(this)}
              >
                Log In
              </Button>
            )}
            {isAuthenticated() && (
              <Button
                bsStyle="primary"
                className="btn-margin"
                onClick={this.logout.bind(this)}
              >
                Log Out
              </Button>
            )}
          </Navbar.Header>
        </Navbar>
        <div>
          <h1>Hello</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated() && (
              <li>
                <Link to="/availability/129d53fa-cb77-4850-9a76-42d9cee1f523">
                  Calendar
                </Link>
              </li>
            )}
            {isAuthenticated() && (
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            )}
            {isAuthenticated() && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
          </ul>

          <hr />

          <Route
            exact
            path="/"
            render={props => <Home auth={this.props.auth} {...props} />}
          />
          <Route
            exact
            path="/profile"
            render={props => <Profile auth={this.props.auth} {...props} />}
          />
          <Route exact path="/login" component={this.login} />
          <Route path="/topics" component={Topics} />
        </div>
      </div>
    );
  }
}
export default App;
