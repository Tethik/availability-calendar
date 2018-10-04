import React, { Component } from 'react';
import Calendar from 'react-big-calendar';
import CalendarAPI from '../api/calendar';

export default class Availability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarId: props.match.params.calendarId,
      events: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const api = new CalendarAPI(this.props.auth);
    const calendar = await api.get(this.state.calendarId);
    this.setState({ events: calendar.dates });
  }

  render() {
    let allViews = Object.keys(Calendar.Views).map(k => Calendar.Views[k]);

    return (
      <div className="App">
        <Calendar
          selectable
          defaultDate={new Date()}
          views={allViews}
          defaultView={Calendar.Views.WEEK}
          events={this.state.events}
          style={{ height: '100vh' }}
          onSelectSlot={this.handleSelect}
        />
      </div>
    );
  }
}
