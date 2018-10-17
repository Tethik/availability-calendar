const Table = require('./base');

class CalendarTable extends Table {
  constructor() {
    super('calendar');
  }
}

module.exports = new CalendarTable();
