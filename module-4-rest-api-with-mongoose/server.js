const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/edx-course-db').catch(err => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(logger('dev'));

const accountSchema = mongoose.Schema({
  name: String,
  balance: Number,
});

var Account = mongoose.model('Account', accountSchema);

app.get('/accounts', (req, res) => {
  Account.find((err, results) => {
    if (err) return res.status(404).send();
    res.statusCode = 200;
    res.send(results);
  });
});

app.post('/accounts', (req, res) => {
  var { name, balance } = req.body;
  if (!name || !balance) return res.sendStatus(422);
  var account = new Account({ name, balance });
  account.save().then(result => res.status(201).send(result))
    .catch(err => { console.error(err); res.sendStatus(500); });
});

app.put('/accounts/:id', (req, res) => {
  var { name, balance } = req.body;
  var obj = { name, balance };
  Object.keys(obj).forEach(key => // removing undefined fields
    obj[key] === undefined ? delete obj[key] : ''
  );
  Account.findByIdAndUpdate(req.params.id, obj, { new: true })
    .then(result => res.status(200).send(result))
    .catch(err => { console.error(err); res.sendStatus(500); });
});

app.delete('/accounts/:id', (req, res) => {
  Account.findByIdAndRemove(req.params.id)
    .then(result => result ? res.status(204).send() : res.status(404).send())
    .catch(err => { console.error(err); res.sendStatus(500); });
});

app.listen(3000);
