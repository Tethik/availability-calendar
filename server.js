var express = require('express')
const NodeCache = require("node-cache");

var app = express()
const storage = new NodeCache();

app.use(express.static('frontend/build'))
app.use(express.json());

app.get('/api/calendar/:calendarId', (req, res) => {
    const { calendarId } = req.params;
    storage.get(calendarId, (err, val) => {
        console.log(val);
        res.json(val || [])
    });
});

app.post('/api/calendar/:calendarId', (req, res, next) => {
    const { calendarId } = req.params;
    storage.set(calendarId, req.body, (err, val) => {
        if (err) { next(err); return; }
        res.json(req.body)
    });
})

console.log("Starting on port 4000");
app.listen(4000)
