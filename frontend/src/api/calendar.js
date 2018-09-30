import moment from 'moment';

const parseDates = result =>
  result.map(({ start, end, title }) => {
    return { start: moment(start).toDate(), end: moment(end).toDate(), title };
  });

export default class CalendarAPI {
  constructor(auth) {
    this.auth = auth;
  }

  get headers() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.auth.getAccessToken()}`,
    };
  }

  async save(calendar) {
    const res = await fetch(`/api/calendar`, {
      method: 'put',
      headers: this.headers,
      body: JSON.stringify(calendar),
    });
    const result = await res.json();
    result.dates = parseDates(result.dates);
    return result;
  }

  async get(id) {
    const res = await fetch(`/api/candidate/${id}`, {
      method: 'get',
      headers: this.headers,
    });
    const result = await res.json();
    result.dates = parseDates(result.dates);
    return result;
  }

  async list() {
    const res = await fetch(`/api/candidate`, {
      method: 'get',
      headers: this.headers,
    });
    const candidates = await res.json();
    candidates.map(can => (can.dates = parseDates(can.dates)));
    return candidates;
  }

  async getAnonymously(anonymousAccessToken) {
    const res = await fetch(`/api/calendar/${anonymousAccessToken}`, {
      method: 'get',
      headers: this.headers,
    });
    const result = await res.json();
    result.dates = parseDates(result.dates);
    return result;
  }

  async saveAnonymously(anonymousAccessToken, calendar) {
    const res = await fetch(`/api/calendar/${anonymousAccessToken}`, {
      method: 'put',
      headers: this.headers,
    });
    const result = await res.json();
    result.dates = parseDates(result.dates);
    return result;
  }

  async userinfo() {
    const res = await fetch(`/api/userinfo`, {
      method: 'get',
      headers: this.headers,
    });
    const result = await res.json();
    result.dates = parseDates(result.dates);
    return result;
  }
}
