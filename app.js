'use strict';

var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen( process.env.PORT || 3000 );
