const Table = require('./base');

class CalendarTable extends Table {
  constructor() {
    super('calendars');
  }
}

module.exports = new CalendarTable();
