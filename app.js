'use strict';

var express = require('express');
var five = require('johnny-five');

var app = express();
var board = new five.Board();

var store = {};

board.on('ready', () => {
  var temperature = new five.Temperature({
    controller: 'LM35',
    pin: 'A0',
    freq: 1000,
  });
  temperature.on('data', (data) => {
    store.temperature = data;
  });
});

// JSON API
app.get('/', (req, res) => res.json(store));

// Metrics for Mackerel
app.get('/metrics', (req, res) => {
  var timestamp = Math.floor( new Date().getTime() / 1000 );
  var metrics = {
    temperature: store.temperature.celsius,
  };
  var arr = [];
  for ( let key in metrics ) {
    arr.push( [ key, metrics[key], timestamp ].join("\t") );
  }
  res.send( arr.join("\n") );
});

// Handle NotFound
app.use((req, res, next) => {
  res.status(404).json({ error: 'NotFound' });
});

// Handle Error
app.use((err, req, res, next) => {
  if ( res.headersSent ) { return next(err); }
  res.status( err.status || 500 );
  res.json({ error: err.message });
});

app.listen( process.env.PORT || 3000 );
