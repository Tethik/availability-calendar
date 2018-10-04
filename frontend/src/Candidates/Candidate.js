import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AvailabilityCalendar from '../AvailabilityCalendar/AvailabilityCalendar';

export default class Candidate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarId: props.match.params.calendarId,
      events: [],
    };
  }

  async load() {
    const candidate = this.props.api.getCalendar(this.state.calendarId);
    this.setState({ ...this.state, candidate });
  }

  render() {
    const { candidate } = this.props;

    return (
      <div>
        <p>
          <big>
            {candidate.name}
            's Availability
          </big>
        </p>
        <AvailabilityCalendar calendarId={candidate.id} {...this.props} />
      </div>
    );
  }
}
