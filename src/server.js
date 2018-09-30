const express = require('express');
const wrap = require('express-async-error-wrapper');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {
  writeAvailabilityCalendar,
  getAvailabilityCalendar,
  getAvailabilityCalendarByAccessToken,
  listAvailabilityCalendar,
} = require('./storage');

const app = express();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://when-can-you.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://localhost:3000/api/',
  issuer: 'https://when-can-you.eu.auth0.com/',
  algorithms: ['RS256'],
});

app.use(express.static('frontend/build'));
app.use(express.json());

var authorizedRouter = express.Router();
authorizedRouter.use(jwtCheck);

authorizedRouter.get(
  '/api/candidate',
  wrap(async (req, res) => {
    console.log(req.user);
    const calendar = await listAvailabilityCalendar(req.user.id);
    console.log(`Get ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.get(
  '/api/candidate/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const calendar = await getAvailabilityCalendar(calendarId);
    console.log(`Get ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.put(
  '/api/candidate/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const calendar = await writeAvailabilityCalendar(req.body);
    console.log(`Put ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.get(
  '/api/userinfo',
  wrap(async (req, res) => {
    console.log(req.user);
    res.json(req.user);
  }),
);

app.use(authorizedRouter);

app.get(
  '/api/calendar/anonymous/:anonymousAccessToken',
  wrap(async (req, res) => {
    const { anonymousAccessToken } = req.params;
    const calendar = await getAvailabilityCalendarByAccessToken(
      anonymousAccessToken,
    );
    console.log(`Anon Get ${calendar.id}`);
    res.json(calendar);
  }),
);

app.put(
  '/api/calendar/anonymous/:anonymousAccessToken',
  wrap(async (req, res) => {
    const { anonymousAccessToken } = req.params;
    const changedCalendar = req.body;
    let calendar = await getAvailabilityCalendarByAccessToken(
      anonymousAccessToken,
    );
    if (!calendar) {
      res.status(404).json({ message: 'Invalid access token' });
    }
    calendar.dates = changedCalendar.dates;

    calendar = await writeAvailabilityCalendar(calendar);

    console.log(`Anon Update ${calendar.id}`);
    res.json(calendar);
  }),
);

console.log('Starting on port 4000');
app.listen(4000);
