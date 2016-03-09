'use strict';

var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use((req, res, next) => {
  res.status(404);
  res.json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  if ( res.headersSent ) { return next(err); }
  res.status( err.status || 500 );
  res.json({ error: err.message });
});

app.listen( process.env.PORT || 3000 );
