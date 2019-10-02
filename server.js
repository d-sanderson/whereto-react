
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Trip = require('./Trip')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbRoute = process.env.MONGODB_URI;
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true } );
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database ^_^'))
db.on('error', console.error.bind(console, 'MongoDB connection error.'))

app.set('port', (process.env.PORT || 3001));

app.get('/api/trips', (req, res, next) => {
  Trip.find({})
    .then(function(trips){
      res.json(trips);
    }, function(err){
      next(err);
    });
  });

app.post('/api/trips', (req, res, next) => {
  let newTrip = new Trip(req.body);
  newTrip.save( (err, trip) => {
    if(err) { return next(err);}
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});