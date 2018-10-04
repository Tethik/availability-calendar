import React, { Component } from 'react';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import CalendarAPI from '../api/calendar';

import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class AvailabilityCalendar extends Component {
  componentDidMount() {
    this.load();
  }

  async load() {
    const api = new CalendarAPI(this.props.auth);
    const calendar = await api.get(this.state.calendarId);
    this.setState({ events: calendar.dates });
  }

  state = {
    events: [],
  };

  mergeEvents = events => {
    // Would use yield here, but javascript is just a bit weird in that syntax :S
    // maybe later.

    const mergedEvents = [];
    // merge events
    for (var i = 0; i < events.length; i += 1) {
      let event = events[i];
      while (i < events.length - 1) {
        const nextEvent = events[i + 1];
        if (nextEvent.start > event.end) break;
        event = this.mergeEventPair(event, nextEvent);
        i += 1;
      }
      mergedEvents.push(event);
    }
    return mergedEvents;
  };

  mergeEventPair = (left, right) =>
    this.createEvent(left.start, left.end > right.end ? left.end : right.end);

  createEvent = (start, end) => ({ start, end, title: 'Available' });

  handleSelect = async ({ start, end }) => {
    const { events } = this.state;

    // Only remove if completely inside existing event.
    // Naive algorithm here for prototyping. Probably better with log n search.
    // But eh.. guesstimating <100 events here.
    const newEvents = [];

    let wasCut = false;
    for (var i = 0; i < events.length; i += 1) {
      const event = events[i];

      // Old event completely covers new event, cut old event where we "deselected"
      if (start >= event.start && end <= event.end) {
        if (start > event.start && end < event.end) {
          newEvents.push(this.createEvent(event.start, start));
          newEvents.push(this.createEvent(end, event.end));
        }
        wasCut = true;
      } else {
        newEvents.push(event);
      }
    }

    if (!wasCut) {
      // Add new availability, might need to merge with existing events.
      newEvents.push(this.createEvent(start, end));
    }

    console.log('After insert', newEvents);

    newEvents.sort((a, b) => a.start - b.start);
    console.log('After sort', newEvents);

    const mergedEvents = this.mergeEvents(newEvents);
    console.log('After merge', mergedEvents);

    const api = new CalendarAPI(this.props.auth);
    const savedEvents = await api.save({
      id: this.state.calendarId,
      dates: mergedEvents,
    });

    this.setState({
      events: savedEvents.dates,
    });
  };

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

export default AvailabilityCalendar;
