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

app.get('/', (req, res) => {
  res.json(store);
});

app.get('/metric', (req, res) => {
  var sec = Math.floor( new Date().getTime() / 1000 );
  var metric = {
    temperature: Math.round( store.temperature.celsius * 10 ) / 10,
  };
  var arr = [];
  for ( var key in metric ) {
    arr.push( [ key, metric[key], sec ].join("\t") );
  }
  res.send( arr.join("\n") );
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  if ( res.headersSent ) { return next(err); }
  res.status( err.status || 500 );
  res.json({ error: err.message });
});

app.listen( process.env.PORT || 3000 );
