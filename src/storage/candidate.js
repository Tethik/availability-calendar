const Table = require('./base');

class CandidateTable extends Table {
  constructor() {
    super('candidate');
  }
}

module.exports = new CandidateTable();
