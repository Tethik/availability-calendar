import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import AvailabilityCalendar from './AvailabilityCalendar/AvailabilityCalendar';
import Topics from './Topics/Topics';
import Candidates from './Candidates/Candidates';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
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
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">WhenCanYouChat?</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            {isAuthenticated() && (
              <NavItem eventKey={1} href="#">
                <Link to="/candidates">Candidates</Link>
              </NavItem>
            )}
            {isAuthenticated() && (
              <NavItem eventKey={2} href="#">
                <Link to="/topics">Topics</Link>
              </NavItem>
            )}
            {isAuthenticated() && (
              <NavItem>
                <Link to="/profile">Profile</Link>
              </NavItem>
            )}
          </Nav>
        </Navbar>
        <div className="container">
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
          <br />
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
          <Route
            exact
            path="/candidates"
            render={props => <Candidates auth={this.props.auth} {...props} />}
          />
          <Route
            path="/availability/:calendarId"
            component={props => (
              <AvailabilityCalendar auth={this.props.auth} {...props} />
            )}
          />
          <Route exact path="/login" component={this.login} />
          <Route path="/topics" component={Topics} />
        </div>
      </div>
    );
  }
}
export default App;
