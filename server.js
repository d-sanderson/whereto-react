const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.set('port', (process.env.PORT || 3001));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/api/trips', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/trips', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const trips = JSON.parse(data);
    const newTrip = {
      origin: req.body.origin,
      destination: req.body.destination,
      travelMode: req.body.travelMode,
      distance: req.body.distance,
      duration: req.body.duration
    };
    trips.push(newTrip);
    fs.writeFile(DATA_FILE, JSON.stringify(trips, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(trips);
    });
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});