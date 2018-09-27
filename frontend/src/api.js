import moment from "moment";

const parseDates = (result) => result.map(({ start, end, title }) => {
    return { start: moment(start).toDate(), end: moment(end).toDate(), title }
});

export async function saveEvents(id, events) {
    console.log(typeof events[0].start);
    console.log(events);
    const res = await fetch(`/api/calendar/${id}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(events)
    });
    const result = await res.json();
    console.log(result);
    console.log(parseDates(result));
    return parseDates(result);
}

export async function getEvents(id) {
    const res = await fetch(`/api/calendar/${id}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const result = await res.json();
    console.log(result);
    return parseDates(result);
}
