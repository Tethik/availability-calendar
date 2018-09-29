const express = require('express');
const wrap = require('express-async-error-wrapper');
const NodeCache = require('node-cache');
const {
  writeAvailabilityCalendar,
  getAvailabilityCalendar,
} = require('./storage');

const app = express();
const storage = new NodeCache();

app.use(express.static('frontend/build'));
app.use(express.json());

app.get(
  '/api/calendar/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const calendar = await getAvailabilityCalendar(calendarId);
    console.log(`Get ${calendar.id}`);
    res.json(calendar);
  }),
);

app.put(
  '/api/calendar',
  wrap(async (req, res) => {
    const calendar = await writeAvailabilityCalendar(req.body);
    console.log(`Put ${calendar.id}`);
    res.json(calendar);
  }),
);

app.err;

console.log('Starting on port 4000');
app.listen(4000);
