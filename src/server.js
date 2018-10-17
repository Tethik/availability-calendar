const express = require('express');
const wrap = require('express-async-error-wrapper');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const calendarStore = require('./storage/calendar');
const candidateStore = require('./storage/candidate');
require('dotenv').config();

const app = express();

app.use(express.static('frontend/build'));
app.use(express.json());

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

var authorizedRouter = express.Router();
authorizedRouter.use(jwtCheck);

authorizedRouter.get(
  '/api/candidate',
  wrap(async (req, res) => {
    const candidates = await candidateStore.scan({ ownerId: req.user.sub });
    res.json(candidates);
  }),
);

authorizedRouter.post(
  '/api/candidate',
  wrap(async (req, res) => {
    let candidate = req.body;
    candidate.ownerId = req.user.sub;
    const calendar = { dates: [] };
    candidate.calendarId = (await calendarStore.create(calendar)).id;
    candidate = await candidateStore.create(candidate);
    console.log(`Created candidate ${candidate.id}`);
    res.json(candidate);
  }),
);

authorizedRouter.get(
  '/api/candidate/:candidateId',
  wrap(async (req, res) => {
    const { candidateId } = req.params;
    const ownerId = req.user.sub;
    const candidate = await candidateStore.get({ id: candidateId, ownerId });
    if (!candidate) {
      res.status(404);
      res.json({ message: 'Not found.' });
      return;
    }
    res.json(candidate);
  }),
);

authorizedRouter.patch(
  '/api/candidate/:candidateId',
  wrap(async (req, res) => {
    const { candidateId } = req.params;
    const ownerId = req.user.sub;
    let candidate = await candidateStore.get({ id: candidateId, ownerId });
    if (!candidate) {
      res.status(404);
      res.json({ message: 'Not found.' });
      return;
    }
    delete req.body.id;
    delete req.body.ownerId;
    candidate = Object.assign(candidate, req.body);
    await candidateStore.update(candidate);
    console.log(`Put ${candidate.id}`);
    res.json(candidate);
  }),
);

authorizedRouter.delete(
  '/api/candidate/:candidateId',
  wrap(async (req, res) => {
    const { candidateId } = req.params;
    const ownerId = req.user.sub;
    let candidate = await candidateStore.get({ id: candidateId, ownerId });
    if (!candidate) {
      res.status(404);
      res.json({ message: 'Not found.' });
      return;
    }
    await candidateStore.delete({ id: candidateId, ownerId });
    console.log(candidate);
    console.log(`Delete ${candidate.id}`);
    res.json(candidate);
  }),
);

authorizedRouter.get(
  '/api/userinfo',
  wrap(async (req, res) => {
    console.log(req.user);
    res.json(req.user);
  }),
);

// Calendars

app.get(
  '/api/calendar/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;
    const calendar = await calendarStore.get({ id: calendarId });
    console.log(`Anon Get ${calendar.id}`);
    res.json(calendar);
  }),
);

app.patch(
  '/api/calendar/:calendarId',
  wrap(async (req, res) => {
    const { calendarId } = req.params;

    let calendar = await calendarStore.get({ id: calendarId });
    if (!calendar) {
      res.status(404);
      res.json({ message: 'Not found.' });
      return;
    }
    delete req.body.id;
    calendar = Object.assign(calendar, req.body);
    await calendarStore.update(calendar);
    console.log(`Anon Update ${calendar.id}`);
    res.json(calendar);
  }),
);

app.use(authorizedRouter);

console.log('Starting on port 4000');
app.listen(4000);
