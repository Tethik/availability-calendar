import moment from 'moment';

const parseDates = result =>
  result.map(({ start, end, title }) => {
    return { start: moment(start).toDate(), end: moment(end).toDate(), title };
  });

export async function saveEvents(calendar) {
  const res = await fetch(`/api/calendar`, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(calendar),
  });
  const result = await res.json();
  result.dates = parseDates(result.dates);
  return result;
}

export async function getEvents(id) {
  const res = await fetch(`/api/calendar/${id}`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  result.dates = parseDates(result.dates);
  return result;
}
