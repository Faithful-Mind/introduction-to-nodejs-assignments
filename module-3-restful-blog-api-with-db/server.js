const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');

const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/', router);

app.use(errorhandler());

app.listen(3000);
