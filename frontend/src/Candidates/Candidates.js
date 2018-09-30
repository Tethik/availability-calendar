import React, { Component } from 'react';
import List from './List';
import Form from './Form';
import CalendarAPI from '../api/calendar';
import { Button } from 'react-bootstrap';

export default class Candidates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      candidates: [],
      page: 0,
      showForm: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const api = new CalendarAPI(this.props.auth);
    const candidates = await api.list();
    this.setState({ ...this.state, candidates });
  }

  handleShowForm = showForm => () => {
    this.setState({ ...this.state, showForm });
  };

  render() {
    return (
      <div>
        <Form show={this.state.showForm} onHide={this.handleShowForm(false)} />

        <div>
          <Button onClick={this.handleShowForm(true)}>New candidate</Button>
        </div>

        {/* <List candidates={this.state.candidates} /> */}
      </div>
    );
  }
}
