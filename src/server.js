const express = require('express');
const wrap = require('express-async-error-wrapper');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {
  putCandidate,
  getCandidate,
  getAvailabilityCalendarByAccessToken,
  deleteCandidate,
  listCandidates,
} = require('./storage');
require('dotenv').config();

const app = express();

const jwtOptions = {
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://when-can-you.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://localhost:3000/api/',
  issuer: 'https://when-can-you.eu.auth0.com/',
  algorithms: ['RS256'],
};

if (process.env['DISABLE_JWT_EXPIRY']) {
  console.log('WARNING: set clockTimeStamp to 0');
  jwtOptions.clockTimestamp = 1;
}

let jwtCheck = jwt(jwtOptions);

app.use(express.static('frontend/build'));
app.use(express.json());

var authorizedRouter = express.Router();
authorizedRouter.use(jwtCheck);

authorizedRouter.get(
  '/api/candidate',
  wrap(async (req, res) => {
    const calendar = await listCandidates(req.user.sub);
    res.json(calendar);
  }),
);

authorizedRouter.get(
  '/api/candidate/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const ownerId = req.user.sub;
    const calendar = await getCandidate(ownerId, calendarId);
    console.log(`Get ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.post(
  '/api/candidate',
  wrap(async (req, res) => {
    const candidate = req.body;
    const ownerId = req.user.sub;
    const calendar = await putCandidate(ownerId, candidate);
    console.log(`Post ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.put(
  '/api/candidate/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    req.body.id = calendarId;
    const ownerId = req.user.sub;
    const calendar = await putCandidate(ownerId, req.body);
    console.log(`Put ${calendar.id}`);
    res.json(calendar);
  }),
);

authorizedRouter.delete(
  '/api/candidate/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const ownerId = req.user.sub;
    const calendar = await deleteCandidate(ownerId, calendarId);
    console.log(`Delete ${calendar.id}`);
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

    calendar = await putCandidate(calendar.ownerId, calendar);

    console.log(`Anon Update ${calendar.id}`);
    res.json(calendar);
  }),
);

console.log('Starting on port 4000');
app.listen(4000);
